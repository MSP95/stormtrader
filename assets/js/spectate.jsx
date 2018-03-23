import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Player1 from './player1';
import StocksDB from './stocksdb';
import Player2 from './player2';
import Timer from './timer';
import Trade from './trade';
import Chat from './chat';
import Graph from './graph';

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
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.users = props.users;
    this.serverState = props.serverState;
    this.state = {
      old_stocks_price: [],
      stocks_names: ["AMZN", "APPL", "BABA", "CSCO", "FB", "GOOG", "GPRO", "IBM", "INTC", "MSFT", "NVDA", "ORCL", "SNAP", "TSLA", "VZ"],
      stocks_price: new Array(15).fill(0),
      stocks_qty: this.serverState.stocks_qty,
      player1: this.serverState.player1,
      player2: this.serverState.player2,
    }
  }

  componentDidMount() {
    //Place socket.on call here
    this.channel.on('get_stocks', (response) => {
      this.setState({old_stocks_price: this.state.stocks_price})
      this.setState({stocks_price: response.stocks})
    });

    this.channel.on("transaction", (response) => {
      let player1 = response.player1
      let player2 = response.player2
      let stocks_qty = response.stocks_qty
      this.setState({player1: player1, player2: player2, stocks_qty: stocks_qty})
    });
  }

  render() {
    return(<div>
      <div className="title-grid">
        <div className="win-status">Player 1 : ${this.state.player1.wallet}</div>
        <div className="wallet-status">Player 2 : ${this.state.player2.wallet}</div>
        <Timer channel={this.channel}/>
      </div>
      <div className="padding"></div>
      <div className="grid">
        <Player1 playerNumber={this.props.playerNumber} player={this.state.player1} stocksPrice={this.state.stocks_price} />
        <StocksDB stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} stocksOldPrice={this.state.old_stocks_price}/>
        <Player2 playerNumber={this.props.playerNumber} player={this.state.player2} stocksPrice={this.state.stocks_price} />
        <Graph channel={this.channel} />
        <Trending stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} stocksOldPrice={this.state.old_stocks_price}/>
        <Chat channel={this.channel} users={this.users}/>
      </div>
    </div>);
  }
}
