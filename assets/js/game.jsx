import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

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
        <div className="wallet-status">Money</div>
        <Timer channel={this.channel}/>
      </div>
      <div className="padding"></div>
      <div className="grid">
        <Trade playerNumber={this.props.playerNumber} player={this.props.playerNumber === 1 ? this.state.player1 : this.state.player2} stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} channel={this.channel}/>
        <Account playerNumber={this.props.playerNumber} player={this.props.playerNumber === 1 ? this.state.player1 : this.state.player2} stocksPrice={this.state.stocks_price} />
        <StocksDB />
        <OtherPlayer />
        <Graph />
        <Trending stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} stocksOldPrice={this.state.old_stocks_price}/>
        <Chat channel={this.channel} users={this.users}/>
      </div>
    </div>);
  }
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0,
      own: [],
    }
  }

  getCurrentWorth(stocks_price, own) {
    let sum = 0
    for(let i = 0; i < own.length; i++) {
      let owned = own[i]
      sum = sum + owned["quantity"] * stocks_price[owned.id]
    }
    this.setState({sum: sum})
  }

  componentWillReceiveProps(newProps) {
    this.setState({own: newProps.player.own})
    this.getCurrentWorth(newProps.stocksPrice, newProps.player.own)
  }

  render() {
    return(<div className="account">
    <div className="header">
      <h5>Stocks You Own</h5>
    </div>
    <div><tr>Current Market Worth</tr><tr>{this.state.sum}</tr></div>
    <div className="account-block">
      <div className="account-table">
        {this.state.own.map((data) => {
          return(<tr key={data.id}><td>{data.name}</td><td>{data.qty}</td><td>{data.bought_at}</td></tr>)
        })}
      </div>
    </div>
  </div>)
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
    this.channel = this.props.channel;
    this.state = {
      own: this.props.player,
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
    // VALIDATE NAME FIRST
    let stock_id = this.props.stocksNames.indexOf(stock_name)
    let buy_object = {stock_id: stock_id, stock_name: stock_name[stock_id], qty: parseInt(stock_quantity), bought_at: this.props.stocksPrice[stock_id]}
    let player = this.props.playerNumber
    let send_object = {player: player, own: buy_object}
    this.channel.push("buy_request", {
      buy: send_object,
    })
    console.log("sent")
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
      <div className="trade-operations">
        <form onSubmit={this.buyStock}>
          <div className="input-group">
            {/*<input onChange={this.handleStockName} className="form-control" name="stock_name" type="text" placeholder="Stock Name"></input>*/}
            <input className="form-control" name="stock_name" type="text" placeholder="Stock Name"></input>
            {/*<input onChange={this.handleStockQty} className="form-control" name="stock_quantity" type="number" placeholder="Quantity"></input>*/}
            <input className="form-control" name="stock_quantity" type="number" placeholder="Quantity"></input>
          </div>
          <div className="height-p4em"></div>
          <input className="buy-btn btn-success" type="submit" value="BUY"></input>
        </form>
      </div>
      <div className="buy-error"><p>{this.state.input_mismatch_error}</p></div>
      <div className="buy-invoice">
        <h5><span className="width-p5em">{this.state.stock_incart}</span><span className="width-p5em">{this.state.stock_current_price}</span><span className="width-p5em">{this.state.symbols[0]}</span><span className="width-p5em">{this.state.stock_qty_incart}</span><span className="width-p5em">{this.state.symbols[1]}</span><span className="width-p5em">{this.state.cart_total}</span></h5>
      </div>
      <div className="trade-operations">
        <form onSubmit={this.sellStock}>
          <div className="input-group">
          <select>
            <option default>Select Stock</option>
          </select>
        </div>
        </form>
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

class Graph extends React.Component {
  render() {
    return(<div className="graph">
    <h5>Graph</h5>
  </div>)
}
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      msgs: [],
      current_msg: "",
    }
  }

  // onChange={this.textChangeHandler}
  // value={this.state.chatInput}
  handleChange(event){
    let input = event.target.value
    this.setState({current_msg: input})

  }
  handleSubmit(event) {
    this.refs.chatinput.value = "";
    this.channel.push("new_chat_send", {body: this.state.current_msg, user: current_user })
    event.preventDefault();
  }
  componentDidMount(){
    let messagesContainer = $("#chatbox")
    this.channel.on("new_chat_receive", payload => {
      console.log(payload);
      let messageItem = `[${payload.user}] ${payload.body}`
      console.log(messageItem)
      this.setState({msgs: this.state.msgs.concat([messageItem])})
      console.log(this.state.msgs);
    })
  }
  render() {
    return(
      <div className="chat">
        <h5 className="header chat-header">Chat</h5>

        <form onSubmit={this.handleSubmit}>
          <div id="chatbox">
            {this.state.msgs.map(function(comp,i){
              return <div key={'msg' + i}>{comp}</div>
            })}

          </div>
          <div className="input-group chat-input-group">
            <input type="text" ref="chatinput" onChange={this.handleChange} className="form-control" id="input-box"
              placeholder="Write a msg."
              required />
            <input type="submit" className="btn btn-success" value = "send"/>
          </div>
        </form>
      </div>);
    }
  }
