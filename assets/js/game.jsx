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
    this.users = props.users;
    this.state = {
      old_stocks_price: [],
      stocks_names: ["AMZN", "APPL", "BABA", "CSCO", "FB", "GOOG", "GPRO", "IBM", "INTC", "MSFT", "NVDA", "ORCL", "SNAP", "TSLA", "VZ"],
      stocks_price: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
      stocks_qty: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
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
    this.channel.on('get_stocks', (response) => {
      this.setState({old_stocks_price: this.state.stocks_price})
      this.setState({stocks_price: response.stocks})
    });
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
        <Trending stocksNames={this.state.stocks_names} stocksPrice={this.state.stocks_price} stocksQty={this.state.stocks_qty} stocksOldPrice={this.state.old_stocks_price}/>
        <Chat channel={this.channel} users={this.users}/>
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

function News() {
  return(<div className="news">
  <h5>News</h5>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
</div>)
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
