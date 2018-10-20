import React, {Component} from 'react';

class GameStatusControl extends Component {
    render() {
        return (
            <div>
                {this.props.isPaused ? (
                    <button onClick={this.props.togglePause}>Resume</button>
                ) : (
                    <button onClick={this.props.togglePause}>Pause</button>
                )}
            </div>
        );
    }
}

export default GameStatusControl;
