import React, { Component } from 'react';
import Canvas from './Canvas';
import Chat from './Chat';
import GameStartControl from './game-controls/GameStartControl';
import GameStatusControl from "./game-controls/GameStatusControl";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            reconnecting: false,
            isHost: props.isHost,
            isPaused: false
        };

        /////////////// Register reconnect, disconnect, ... ////////////////
        this.props.socket.on('reconnect', () => {
            let userId = localStorage.getItem('userName');
            this.props.socket.emit('reconnect', userId);
        });

        this.props.socket.on('reconnecting', () => {
            this.setState({reconnecting : true});
        });

        this.props.socket.on('connect_error', error => {
            console.log('Could not connect. Reason: ' + error);
        });

        this.props.socket.on('disconnect', reason => {
            if(reason === 'io server disconnect') {
                this.props.socket.connect();
            }
        });

        this.props.socket.on('toggle pause', playing => {
            this.setState({
                isPaused: !playing
            })
        });

        /////////////// Register message event handlers ////////////////////
        this.props.socket.on('new message', message => {
            const newMessage = {
                userName: message.userName,
                color: message.color,
                text: message.text,
                id: message.id,
                timestamp: message.timestamp
            };
            this.setState({ messages: [...this.state.messages, newMessage] });
        });

        this.props.socket.on('userlist', users => {
            console.log(users);
        });

        this.startGame = this.startGame.bind(this);
        this.togglePause = this.togglePause.bind(this);
    }
    sendMessage(message) {
        const msg = {
            userName: this.props.userName,
            roomId: this.props.roomId,
            text: message,
            userId: this.props.userId
        };
        this.props.socket.emit('new message', msg);
    }

    startGame(rounds) {
        this.props.socket.emit('start game', rounds);
    }

    togglePause() {
        this.props.socket.emit('toggle pause');
    }

    render() {
        console.log(this.state.isPaused);
        return (
            <div className="Game">
                {this.state.isHost &&
                <GameStartControl startGame={this.startGame}/>
                }
                {this.state.isHost &&
                <GameStatusControl togglePause={this.togglePause} isPaused={this.state.isPaused} />
                }
                <Canvas socket={this.props.socket} />
                <Chat messages={this.state.messages} sendMessage={this.sendMessage.bind(this)}/>
            </div>
        );
    }
}

export default Game;
