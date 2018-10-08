import React, { Component } from 'react';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

class Chat extends Component {
    render() {
        return (
            <div className="Chat">
                <MessageList messages = {this.props.messages}/>
                <SendMessageForm sendMessage = {this.props.sendMessage}/>
            </div>
        );
    }
}

export default Chat;
