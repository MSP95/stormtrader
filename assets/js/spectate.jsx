import React from 'react';
import ReactDOM from 'react-dom';

export default function spectate_init(root, state, channel, users) {
  let current_player = 0;
  if(state.gamestate.player1.user_id === parseInt(current_user)) {
    current_player = 1
  }
  if(state.gamestate.player2.user_id === parseInt(current_user)) {
    current_player = 2
  }
  ReactDOM.render(<Spectate playerNumber={current_player} serverState={state.gamestate} channel={channel} users={users}/>, root);
}

class Spectate extends React.Component {
  render() {
    return(<div>YOU ARE A SPECTATOR</div>)
  }
}
