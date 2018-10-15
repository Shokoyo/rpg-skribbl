import React, { Component } from 'react';
import Game from './game/Game';
import logo from './logo.svg';
import './App.css';
import openSocket from "socket.io-client";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket : openSocket('http://localhost:8888'),
            userName : '',
            roomId : '',
            joinedRoom : false
        };
        this.state.socket.on('joined room', roomId => {
            console.log('Joined Room');
            this.setState({
                roomId : roomId,
                joinedRoom: true
            });
        });

        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUserNameChange(event) {
        this.setState({ userName : event.target.value });
    }

    handleRoomIdChange(event) {
        this.setState({ roomId : event.target.value });
    }

    handleSubmit(event) {
        if(this.state.roomId === '') {
            let userId = localStorage.getItem('userName');
            if (userId === null || userId === 'undefined') {
                userId = this.state.socket.id;
                localStorage.setItem('userName', userId);
            }
            console.log('Creating room');
            this.state.socket.emit('create room', this.state.userName, userId);
        } else {
            let userId = localStorage.getItem('userName');
            if (userId === null || userId === 'undefined') {
                userId = this.state.socket.id;
                localStorage.setItem('userName', userId);
            }
            console.log('Joining room ' + this.state.roomId);
            this.state.socket.emit('join room', this.state.roomId, this.state.userName, userId);
        }
        event.preventDefault();
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
              {this.state.joinedRoom ? (
                  <Game roomId={this.state.roomId}
                      userName={this.state.userName}
                      socket={this.state.socket}/>
              ) : (
                  <form onSubmit={this.handleSubmit}>
                      <label>
                          User Name:
                          <input type="text" name="name" value={this.state.userName} onChange={this.handleUserNameChange} />
                      </label>
                      <label>
                          Room Name:
                          <input type="text" name="roomId" value={this.state.roomId} onChange={this.handleRoomIdChange} />
                      </label>
                      <input type="submit" value="Submit" />
                  </form>
              )}
          </div>
        </div>
      );
    }
}

export default App;
