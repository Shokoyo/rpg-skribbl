import React, { Component } from 'react';
import Immutable from 'immutable';
import './Canvas.css';

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            socket: props.socket,
            isDrawing: false,
            lines: new Immutable.List(),
            isDrawingEnabled: true
        };

        this.state.socket.on('new line', (line) => {
            this.setState(prevState => {
                return {
                    lines: prevState.lines.push(line)
                }
            });
            console.log(this.state.lines);
        });

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }
    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }
    handleMouseUp() {
        if(this.state.isDrawingEnabled && this.state.isDrawing) {
            this.state.socket.emit('new line', this.state.lines.last());
        }
        this.setState({isDrawing: false});
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0 || !this.state.isDrawingEnabled) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => {
            return {
                lines: prevState.lines.push(new Immutable.List([point])),
                isDrawing: true,
            };
        });

        mouseEvent.preventDefault();
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing || !this.state.isDrawingEnabled) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => {
            return {
                lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
            };
        });
    }

    render() {
        return (
            <div
                className="drawArea"
                ref="drawArea"
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >
                <Drawing lines={this.state.lines} />
            </div>
        );
    }
}

function Drawing({ lines }) {
    return (
        <svg className="drawing">
            {lines.map((line, index) => (
                <DrawingLine key={index} line={line} />
            ))}
        </svg>
    );
}

function DrawingLine({ line }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} />;
}

export default Canvas;
