import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default function game_init(root, state, channel, users) {
  //console.log(users)
  ReactDOM.render(<Game channel={channel} users={users}/>, root);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let playerStatus = "";
    this.playerStatus = this.getPlayerStatus();
  }
  getPlayerStatus() {
    if (current_user == this.props.users[this.props.users.length - 1]) {
      return "player1";
    }
    if (current_user == this.props.users[this.props.users.length - 2]) {
      return "player2";
    }
    else {
      return "spectator";
    }
  }

  componentDidMount() {
    //Place socket.on call here
  }

  render() {
    return(<div>
      <div className="title-grid">
        <div className="account">Account</div>
        <div className="win-status">{this.playerStatus}</div>
        <div className="wallet-status">Money</div>
        <div className="timer">Timer</div>
      </div>
      <div className="padding"></div>
      <div className="grid">
        <Trade />
        <StocksDB />
        <OtherPlayer />
        <News />
        <Trending />
        <Chat />
      </div>
    </div>);
  }
}

function Trade() {
  return(<div className="trade">
  <h5>Trade</h5>
</div>);
}

function StocksDB() {
  return(<div className="stocksdb">
  <h5>Stocks</h5>
</div>);
}

function OtherPlayer() {
  return(<div className="otherplayer">
  <h5>Other</h5>
</div>);
}

function Trending() {
  return(<div className="trending">
  <div className="header">
  <h5>Trending</h5>
  </div>
</div>);
}

function News() {
  return(<div className="news">
  <h5>News</h5>
</div>)
}

function Chat() {
  return(<div className="chat">
  <h5>Chat</h5>
</div>);
}
