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
    this.channel = props.channel;
    this.state = {
      stocks_names: ["APPL", "GOOG", "FB"],
      stocks_price: [100, 200, 300],
      stocks_qty: [50, 50, 50],
      player1: {wallet: "", own: []},
      player2: {wallet: "", own: []},
    }
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
    // this.channel.on('start_timer', function(response) {
    //   //console.log(response.time);
    //   let minutes = Math.floor(response.time / 60);
    //   let seconds = response.time - minutes * 60;
    //   let time_left = minutes+" : "+seconds;
    //   console.log(time_left)
    // });
  }

  render() {
    return(<div>
      <div className="title-grid">
        <div className="account">Account</div>
        <div className="win-status">{this.playerStatus}</div>
        <div className="wallet-status">Money</div>
        <Timer channel={this.channel}/>
      </div>
      <div className="padding"></div>
      <div className="grid">
        <Trade stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty}/>
        <StocksDB />
        <OtherPlayer />
        <News />
        <Trending />
        <Chat />
      </div>
    </div>);
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      timer: "",
    }
  }

  componentDidMount() {
    this.channel.on('start_timer', (response) => {
      //console.log(response.time);
      let minutes = Math.floor(response.time / 60);
      let seconds = response.time - minutes * 60;
      let time_left = minutes+" : "+seconds;
      this.setState({timer: time_left});
    });
  }

  render() {
    return(<div className="timer">{this.state.timer}</div>)
  }
}

class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.buyStock = this.buyStock.bind(this);
    this.handleStockName = this.handleStockName.bind(this);
    this.handleStockQty = this.handleStockQty.bind(this);
    this.state = {
      input_mismatch_error: "",
      stock_incart: "",
      symbols: [],
      stock_qty_incart: "",
      cart_total: "",
      stock_current_price: "",
    }
  }

  buyStock(event) {
    event.preventDefault();
    let stock_name = event.target.stock_name.value;
    let stock_quantity = event.target.stock_quantity.value;
    this.setState({input_mismatch_error: "You cannot buy this"})
  }

  handleStockName(event) {
    let input = event.target.value;
    let stocksNames = this.props.stocksNames;
    let stocksPrice = this.props.stocksPrice;
    let index = stocksNames.indexOf(input);
    if (stocksNames.includes(input.toUpperCase())) {
      this.setState({stock_incart: input.toUpperCase(), symbols: ["x"], stock_current_price: "($"+stocksPrice[index]+")", input_mismatch_error: ""})
    }
    else if (input === "") {
      this.setState({stock_qty_incart: "", cart_total: "", stock_incart: "", symbols: [], stock_current_price: "", input_mismatch_error: ""})
    }
    else {
      this.setState({stock_qty_incart: "", cart_total: "", stock_incart: "", symbols: [], stock_current_price: "", input_mismatch_error: "Invalid Stock Name"})
    }
  }

  handleStockQty(event) {
    let input = event.target.value;
    let stock_incart = this.state.stock_incart;
    let stocksQty = this.props.stocksQty;
    let stocksPrice = this.props.stocksPrice;
    let stocksNames = this.props.stocksNames;
    let index = stocksNames.indexOf(stock_incart);
    if (input <= stocksQty[index]) {
      let price = input * stocksPrice[index]
      this.setState({stock_qty_incart: input, cart_total: "$"+price, symbols: ["x","="], input_mismatch_error: ""})
    }
    else {
      this.setState({stock_qty_incart: "", cart_total: "", symbols: [], input_mismatch_error: "Demand exceeding the available quantity"})
    }

  }


  render() {
    return(<div className="trade">
    <div className="trade-grid">
      <div className="trade-operations"></div>
      <div className="trade-operations">
        <form onSubmit={this.buyStock}>
          <div className="input-group">
            <input onChange={this.handleStockName} className="form-control" name="stock_name" type="text" placeholder="Stock Name"></input>
            <input onChange={this.handleStockQty} className="form-control" name="stock_quantity" type="number" placeholder="Quantity"></input>
          </div>
          <div className="height-p4em"></div>
          <input className="buy-btn btn-success" type="submit" value="BUY"></input>
        </form>
      </div>
      <div className="buy-error"><p>{this.state.input_mismatch_error}</p></div>
      <div className="buy-invoice">
        <h5><span className="width-p5em">{this.state.stock_incart}</span><span className="width-p5em">{this.state.stock_current_price}</span><span className="width-p5em">{this.state.symbols[0]}</span><span className="width-p5em">{this.state.stock_qty_incart}</span><span className="width-p5em">{this.state.symbols[1]}</span><span className="width-p5em">{this.state.cart_total}</span></h5>
      </div>
    </div>
  </div>);
}
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
  return(<div className="card chat">
  <h5 className="card-header">Chat</h5>

</div>);
}
