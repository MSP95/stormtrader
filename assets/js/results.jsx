import React from 'react';
import ReactDOM from 'react-dom';

export default function wait_init(root, winner, gamestate) {
  console.log(winner);
  ReactDOM.render(
    <Result winner={winner} gamestate={gamestate} />, root);

}

class Result extends React.Component {
  render(){
    return(
      <div className="container">
          <div className="jumbotron">

            Winner is {this.props.winner}
          </div>
      </div>
    )
  }
}
