import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type GameStateElement = 'O' | 'X' | null;
type GameStateHistory = {
    squares: Array<GameStateElement>
};
type GameState = {
    history: Array<GameStateHistory>;
    stepNumber: number;
    xIsNext: boolean;
};

type SquareProps = {
    value: GameStateElement;
    onClick: () => void;
};

function Square(props: SquareProps) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
        >
            { props.value }
        </button>
    );
}

class Board extends React.Component<any, GameState> {
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
        );
    }

    private renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
}

class Game extends React.Component<any, GameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            history: [{
                squares: Array<GameStateElement>(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext : true
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.checkWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}` :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.getCurrentSymbol()}`;
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i: number) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }

    private jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step & 1) === 0,
        });
    }

    private handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.checkWinner(squares) || squares[i])
            return;
        squares[i] =  this.getCurrentSymbol();
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    private getCurrentSymbol(): GameStateElement
    {
        return this.state.xIsNext ? 'X' : 'O';
    }

    private checkWinner(squares: GameStateElement[]): GameStateElement | null {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<Game />);

// https://ko.reactjs.org/tutorial/tutorial.html#showing-the-past-moves

