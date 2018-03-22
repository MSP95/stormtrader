import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import OtherPlayer from './otherplayer';
import StocksDB from './stocksdb';
import Account from './account';
import Timer from './timer';
import Trade from './trade';
import Chat from './chat';
import Graph from './graph';

export default function game_init(root, state, channel, users) {
  let current_player = 0;
  if(state.gamestate.player1.user_id === parseInt(current_user)) {
    current_player = 1
  }
  if(state.gamestate.player2.user_id === parseInt(current_user)) {
    current_player = 2
  }
  ReactDOM.render(<Game playerNumber={current_player} serverState={state.gamestate} channel={channel} users={users}/>, root);
}

class Game extends React.Component {
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
        <div>Account</div>
        <div className="win-status">{this.playerStatus}</div>
        <div className="wallet-status">Money Left : ${this.props.playerNumber === 1 ? this.state.player1.wallet : this.state.player2.wallet}</div>
        <Timer channel={this.channel}/>
      </div>
      <div className="padding"></div>
      <div className="grid">
        <Trade playerNumber={this.props.playerNumber} player={this.props.playerNumber === 1 ? this.state.player1 : this.state.player2} stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} channel={this.channel}/>
        <Account playerNumber={this.props.playerNumber} player={this.props.playerNumber === 1 ? this.state.player1 : this.state.player2} stocksPrice={this.state.stocks_price} />
        <StocksDB />
        <OtherPlayer player={this.props.playerNumber === 1 ? this.state.player2 : this.state.player1}/>
        <Graph stocksPrice={this.state.stocks_price}/>
        <Trending stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} stocksOldPrice={this.state.old_stocks_price}/>
        <Chat channel={this.channel} users={this.users}/>
      </div>
    </div>);
  }
}

function Trending(params) {
  let stocks_names = params["stocksNames"]
  let stocks_price = params["stocksPrice"]
  let stocks_quantity = params["stocksQty"]
  let old_stocks_price = params["stocksOldPrice"]
  let obj = []
  for(let i = 0; i < stocks_names.length; i++) {
    obj.push({id: i, name: stocks_names[i], price: stocks_price[i], quantity: stocks_quantity, change: stocks_price[i] - old_stocks_price[i]})
  }
  obj.sort((a,b) => {
    return a.price < b.price;
  })
  let topFive = obj.slice(0,5)
  return(<div className="trending">
  <div className="header">
    <h5>Trending</h5>
  </div>
  <div className="trending-block">
    <div className="trending-table">
      {topFive.map((data) => {
        return(<tr key={data.id}><td>{data.name}</td><td>{data.price}</td><td>{data.change > 0 && <div className="arrow-up"></div>}{data.change < 0 && <div className="arrow-down"></div>}</td></tr>)
      })}
    </div>
  </div>
</div>);
}
