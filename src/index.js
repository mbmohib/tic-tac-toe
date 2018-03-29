import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.value[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>

                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>

                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

function Steps(props) {
    return props.moves.map(index => {
        return (
            <li
                className={
                    props.stepNumber == index && props.active ? 'active' : ''
                }
                key={index}
                onClick={() => props.jumpTo(index)}
            >
                <button>Go to Step {index}</button>
            </li>
        )
    })
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            active: false,
            moves: [0],
            sortStatus: true
        }
        this.sortMove = this.sortMove.bind(this)
    }

    handleClick(i) {
        const current = this.state.history[this.state.history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: this.state.history.concat({ squares }),
            xIsNext: !this.state.xIsNext,
            stepNumber: this.state.history.length,
            moves: this.state.moves.concat(this.state.moves.length)
        })
    }

    jumpTo(index) {
        this.setState({
            stepNumber: index,
            xIsNext: index % 2 === 0,
            active: true
        })
    }

    sortMove() {
        this.setState({
            moves: this.state.moves.reverse(),
            sortStatus: !this.state.sortStatus
        })
    }

    render() {
        const current = this.state.history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let status

        if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        value={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>

                <div className="game-info">
                    <div className="status">
                        {status}
                        <button className="btn" onClick={this.sortMove}>
                            {this.state.sortStatus ? 'Sort Descending' : 'Sort Ascending'}
                        </button>
                    </div>

                    <Steps
                        moves={this.state.moves}
                        active={this.state.active}
                        stepNumber={this.state.stepNumber}
                        jumpTo={index => this.jumpTo(index)}
                    />
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a]
        }
    }
    return null
}

ReactDOM.render(<Game />, document.getElementById('root'))
