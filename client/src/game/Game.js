import React, { Component } from 'react';
import Canvas from './Canvas';
import Chat from './Chat';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: props.roomId,
            userName: props.userName,
            userId: props.userId,
            messages: [],
            reconnecting: false,
            socket: props.socket
        };

        /////////////// Register reconnect, disconnect, ... ////////////////
        this.state.socket.on('reconnect', () => {
            let userId = localStorage.getItem('userName');
            this.state.socket.emit('reconnect', userId);
        });

        this.state.socket.on('reconnecting', () => {
            this.setState({reconnecting : true});
        });

        this.state.socket.on('connect_error', error => {
            console.log('Could not connect. Reason: ' + error);
        });

        this.state.socket.on('disconnect', reason => {
            if(reason === 'io server disconnect') {
                this.state.socket.connect();
            }
        });

        /////////////// Register message event handlers ////////////////////
        this.state.socket.on('new message', message => {
            const newMessage = {
                userName: message.userName,
                color: message.color,
                text: message.text,
                id: message.id,
                timestamp: message.timestamp
            };
            this.setState({ messages: [...this.state.messages, newMessage] });
        });

        this.state.socket.on('userlist', users => {
            console.log(users);
        })

        /*this.state.ws = new Sockette('ws://localhost:8888/rpg-skribbl/game-ws', {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: () => {
                this.state.ws.send(JSON.stringify({
                    type: 'joinRoom',
                    roomId: this.state.roomId,
                    userName: this.state.userName
                }));
            },
            onmessage: e => this.handleData(e),
            onreconnect: e => console.log('Reconnecting...', e),
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
        });*/


    }
    sendMessage(message) {
        const msg = {
            userName: this.state.userName,
            roomId: this.state.roomId,
            text: message,
            userId: this.state.userId
        };
        console.log(this.state.socket);
        console.log(msg);
        this.state.socket.emit('new message', msg);
    }
    render() {
        return (
            <div className="Game">
                <Canvas socket={this.state.socket} />
                <Chat messages={this.state.messages} sendMessage={this.sendMessage.bind(this)}/>
            </div>
        );
    }
}

export default Game;
