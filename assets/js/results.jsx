import React from 'react';
import ReactDOM from 'react-dom';

export default function wait_init(root, winner, gamestate) {
  let status = ""
  if (winner instanceof Object) {
    status = "winner"
  }
  if (winner instanceof String) {
    status = "tie"
  }
  ReactDOM.render(<Result status={status} winner={winner} gamestate={gamestate}/>, root);
}

class Result extends React.Component {
  render() {
    return (<div className="result">
      <div></div>
      <div className="result-block">
        <div className="result-body">
          <div></div>
          <div className="result-status header">{
              this.props.status === "winner"
                ? "Winner is " + this.props.winner.name + "!"
                : "It is a tie!"
            }</div>
          <div className="result-details">
            <div className="player1-result">
              <div className="player-name">{this.props.gamestate.player1.user_name}</div>
              <div className="result-data">Wallet: ${this.props.gamestate.player1.wallet}</div>
            </div>
            <div className="player2-result">
              <div className="player-name">{this.props.gamestate.player2.user_name}</div>
              <div className="result-data">Wallet: ${this.props.gamestate.player2.wallet}</div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>)
  }
}
