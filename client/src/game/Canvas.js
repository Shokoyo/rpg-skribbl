import React, { Component } from 'react';
import './Canvas.css';

class Canvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            socket: props.socket,
            isDrawing: false,
            lines: [],
            isDrawingEnabled: true
        };

        this.state.socket.on('new line', line => {
            this.setState(prevState => {
                prevState.lines.push(line);
                return {
                    lines: prevState.lines
                }
            });
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
            this.state.socket.emit('new line', this.state.lines[this.state.lines.length - 1]);
        }
        this.setState({isDrawing: false});
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0 || !this.state.isDrawingEnabled) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => {
            prevState.lines.push([point]);
            return {
                lines: prevState.lines,
                isDrawing: true,
            };
        });

        mouseEvent.preventDefault();
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        };
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing || !this.state.isDrawingEnabled) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => {
            prevState.lines[prevState.lines.length - 1].push(point);
            return {
                lines: prevState.lines,
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
            {lines.map((line,index) => (
                <DrawingLine key={index} line={line} />
            ))}
        </svg>
    );
}

function DrawingLine({ line }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p.x} ${p.y}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} />;
}

export default Canvas;
