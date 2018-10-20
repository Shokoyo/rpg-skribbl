import React, {Component} from 'react';

class GameStartControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rounds: 3
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRoundsChange = this.handleRoundsChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.startGame(this.state.rounds);
    }

    handleRoundsChange(event) {
        this.setState({ rounds: event.target.value });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Rounds:
                        <input type="number" name="rounds" value={this.state.rounds} onChange={this.handleRoundsChange} />
                    </label>
                    <input type="submit" value="Start Game" />
                </form>
            </div>
        );
    }
}

export default GameStartControl;
