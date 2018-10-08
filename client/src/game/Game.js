import React, { Component } from 'react';
import Sockette from 'sockette';
import Canvas from './Canvas';
import Chat from './Chat';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: props.roomId,
            userId: props.userId,
            messages: []
        };
        this.state.ws = new Sockette('ws://localhost:8888/rpg-skribbl/game-ws', {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: () => {
                this.state.ws.send(JSON.stringify({
                    type: 'joinRoom',
                    roomId: this.state.roomId,
                    userId: this.state.userId
                }));
            },
            onmessage: e => this.handleData(e),
            onreconnect: e => console.log('Reconnecting...', e),
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
        });

        // Reconnect 10s later
        setTimeout(this.state.ws.reconnect, 10e3);
    }
    handleData(data) {
        let result = JSON.parse(data.data);
        if(result.type === 'newMsg') {
            const newMsg = {
                userId: result.userId,
                color: result.color,
                text: result.text,
                id: result.id,
                timestamp: result.timestamp
            };
            this.setState({ messages: [...this.state.messages, newMsg] });
        }
    }
    sendMessage(message) {
        const msg = {
            type: 'newMsg',
            userId: this.state.userId,
            roomId: this.state.roomId,
            text: message
        };
        this.state.ws.send(JSON.stringify(msg));
    }
    render() {
        return (
            <div className="Game">
                <Canvas/>
                <Chat messages={this.state.messages} sendMessage={this.sendMessage.bind(this)}/>
            </div>
        );
    }
}

export default Game;
