import React, { Component } from 'react';

class MessageList extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         messages: props.messages
    //     }
    // }
    render() {
        return (
            <ul className="message-list">
            {this.props.messages.map(message => {
                return (
                    <li key={message.id} className={'color-' + message.color}>
                        <b>{message.userName}</b> : {message.text}
                    </li>
                )
            })}
            </ul>
        );
    }
}

export default MessageList;