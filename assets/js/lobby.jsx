import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default function lobby_init(root, lobby) {
  ReactDOM.render(<Games lobby={lobby}/>, root);
}

class Games extends React.Component {
  constructor(props) {
    super(props);
    this.lobby = props.lobby;
    this.state = {
      game_list: ""
    };

    this.lobby.join().receive("ok", this.gotView.bind(this)).receive("error", resp => {
      console.log("Unable to join", resp);
    });
    this.lobby_listener();
  }

  gotView(view) {
    this.setState(view);
  }

  lobby_listener() {
    this.lobby.on('lobby_update', this.gotView.bind(this))
  }

  // /////////////////////////////////////////////////////////////////////
  render() {
    let torender = $.map(this.state.game_list, function(value, key) {
      let gameid = key.slice(6)
      let game = "games/";
      var joinlink = <a href={game.concat(gameid)}>spectate</a>
      if (value.length < 2) {
        joinlink = <a href={game.concat(gameid)}>Join</a>
      }
      return <li className="list-group-item" key={key}>
        {key}&nbsp;
        | Players: {value.toString()}&nbsp;
        | {joinlink}
      </li>
    })
    return (<div>
      <ul className="list-group">
        {
          torender.length === 0
            ? "Sorry! No games currently being played"
            : torender
        }
      </ul>

    </div>);
  }
}
