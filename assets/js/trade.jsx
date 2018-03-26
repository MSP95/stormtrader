import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './timer';

export default class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.buyStock = this.buyStock.bind(this);
    this.sellStock = this.sellStock.bind(this);
    this.sellSelect = this.sellSelect.bind(this);
    this.handleStockName = this.handleStockName.bind(this)
    this.handleStockQty = this.handleStockQty.bind(this)
    this.sellStockQty = this.sellStockQty.bind(this)
    this.handleNameClick = this.handleNameClick.bind(this)
    this.handleQtyClick = this.handleQtyClick.bind(this)
    this.handleSellClickQty = this.handleSellClickQty.bind(this)
    this.channel = this.props.channel;
    this.state = {
      stocks_array: [],
      stocks_qty: [],
      own: [],
      selected: "",
      status: "",
      sell_status: "",
      stock_name: "",
      qty: "",
      stock_id: "",
      stock_sell: "",
      sell_qty: "",
    }
  }

  componentWillReceiveProps(props) {
    let unique = props.player.own
    let stock_name = props.stocksNames
    let stocks = []
    let qty = new Array(15).fill(0);
    let obj = []
    for(let i = 0; i < unique.length; i++) {
      if(!stocks.includes(unique[i].stock_name)) {
        stocks.push(unique[i].stock_name)
        qty[stock_name.indexOf(unique[i].stock_name)] = qty[stock_name.indexOf(unique[i].stock_name)] + unique[i].qty
      }
      else {
        qty[stock_name.indexOf(unique[i].stock_name)] = qty[stock_name.indexOf(unique[i].stock_name)] + unique[i].qty
      }
    }
    for(let i = 0; i < stocks.length; i++) {
      obj.push({id: stock_name.indexOf(stocks[i]), name: stocks[i], qty: qty[stock_name.indexOf(stocks[i])]})
    }
    this.setState({stocks_array: stocks, stocks_qty: qty, own: obj})
  }


  buyStock(event) {
    event.preventDefault();
    let stock_name = event.target.stock_name.value.toUpperCase();
    let stock_quantity = event.target.stock_quantity.value;
    let stock_id = this.props.stocksNames.indexOf(stock_name)
    let buy_object = {stock_id: stock_id, stock_name: stock_name, qty: parseInt(stock_quantity), bought_at: this.props.stocksPrice[stock_id]}
    let player = this.props.playerNumber
    let send_object = {player: player, own: buy_object}
    if(stock_name != "" && stock_quantity != "" && stock_id != -1) {
      this.channel.push("buy_request", {
        buy: send_object,
      }).receive("ok", msg => {
        if(msg.status === "No stocks left") {
          this.setState({status: "Quantity cannot be supplied!"})
        }
        if(msg.status === "Not enough money") {
          this.setState({status: "Not enough money to buy!"})
        }
        if(msg.status === "successfull") {
          this.setState({status: "Successfully bought!"})
        }
      })
    }
    else {
      this.setState({status: "Invalid input"})
    }
  }

  handleStockName(event) {
    let input = event.target.value.toUpperCase();
    let stocksNames = this.props.stocksNames;
    let index = stocksNames.indexOf(input);
    if (stocksNames.includes(input)) {
      this.setState({stock_name: input, status: "", stock_id: index})
    }
    else if (input === "") {
      this.setState({status: "", stock_name: "", status: "", stock_id: ""})
    }
    else {
      this.setState({stock_name: "", status: "Invalid name!", stock_id: ""})
    }
  }

  handleNameClick() {
    this.refs.stock_name.value = ""
    this.setState({status: "", sell_status: ""})
  }

  handleQtyClick() {
    this.refs.stock_quantity.value = ""
    this.setState({status: "", sell_status: ""})
  }

  handleSellClickQty() {
    this.setState({status: "", sell_status: ""})
  }

  handleStockQty(event) {
    let input = event.target.value.toUpperCase();
    this.setState({qty: input})
    this.setState({status: ""})
  }

  sellStock(event) {
    event.preventDefault();
    let stock_quantity = event.target.sell_quantity.value;
    let stock_id = this.state.selected;
    let stock_name = this.props.stocksNames[stock_id]
    let sell_object = {stock_id: parseInt(stock_id), stock_name: stock_name, qty: parseInt(stock_quantity), sold_at: this.props.stocksPrice[stock_id]}
    let player = this.props.playerNumber
    let send_object = {player: player, own: sell_object}
    if(this.state.selected === "") {
      this.setState({stock_sell: ""})
    }
    if(this.state.selected != "" && this.state.sell_qty != "") {
      this.channel.push("sell_request", {
        sell: send_object,
      }).receive("ok", msg => {
        if(msg.status === "Invalid Quantity") {
          this.setState({sell_status: "Invalid quantity!"})
        }
        if(msg.status === "success") {
          this.setState({sell_status: "Successfully sold!"}, () => {
            if(this.state.stocks_qty[this.state.selected] === 0) {
              this.setState({stock_sell: "", selected: "", sell_qty: ""})
              }
              else {
                this.setState({sell_qty: ""})
              }
              this.refs.sell_quantity.value = ""
          })
        }
      })
    }
    else {
      this.setState({sell_status: "Select a stock and/or enter quantity to sell"})
    }
  }

  sellSelect(event) {
    this.setState({selected: event.target.value})
    this.setState({stock_sell: this.props.stocksNames[event.target.value]})
    if(event.target.value === "") {
      this.setState({stock_sell: ""})
    }
  }

  sellStockQty(event) {
    let input = event.target.value
    this.setState({sell_qty: input})
    this.setState({sell_status: ""})
    if(event.target.value > this.state.stocks_qty[this.state.selected]) {
      this.setState({sell_status: "Entered more quantity than you own!"})
    }
    else {
      this.setState({sell_status: ""})
    }
  }

  render() {
    return(<div className="trade">
    <div className="trade-grid">
      <div className="timer-wallet">
      <div className="wallet-status">Money Left : ${this.props.playerNumber === 1 ? this.props.player1.wallet : this.props.player2.wallet}</div>
      <div><Timer channel={this.channel}/></div>
      </div>
      <div className="trade-operations">
        <form onSubmit={this.buyStock}>
          <div className="input-group">
            <input className="form-control" ref="stock_name" name="stock_name" type="text" placeholder="Stock Name" onClick={this.handleNameClick} onChange={this.handleStockName}></input>
            <input className="form-control" ref="stock_quantity" name="stock_quantity" type="number" placeholder="Quantity" onClick={this.handleQtyClick} onChange={this.handleStockQty}></input>
          </div>
          <div className="height-p4em"></div>
          <input className="buy-btn btn-success" type="submit" value="BUY"></input>
        </form>
      </div>
      <div className="status-operations"><div className="buy-error"><p>{this.state.status}</p></div></div>
      <div className="status-operations">
        <div className="buy-invoice">
          <p>{this.state.stock_name}<span className="width-p5em">{this.state.stock_name != "" && <span> (${this.props.stocksPrice[this.state.stock_id]})<span> x</span></span>}</span><span className="width-p5em">{this.state.stock_name != "" && <span>{this.state.qty}</span>}<span className="width-p5em">{this.state.stock_name != "" && <span> = <span className={this.props.stocksPrice[this.state.stock_id] * this.state.qty > this.props.player.wallet ? "cannotbuy" : "canbuy"}>${this.props.stocksPrice[this.state.stock_id] * this.state.qty}</span></span>}</span></span></p>
        </div>
      </div>
      <div className="trade-operations">
        <form onSubmit={this.sellStock}>
          <div className="input-group">
            <select className="form-control" onChange={this.sellSelect}>
              <option default value="">Select Stock</option>
              {this.state.own.map((data) => {
                return(<option key={data.id} value={data.id}>{data.name}</option>)
              })}
            </select>
            <input className="form-control" ref="sell_quantity" name="sell_quantity" type="number" onClick={this.handleSellClickQty} placeholder={this.state.selected != "" ? "You own "+this.state.stocks_qty[this.state.selected]+" stock(s)" : "Quantity"} onChange={this.sellStockQty}></input>
          </div>
          <div className="height-p4em"></div>
          <input className="buy-btn btn-danger" type="submit" value="SELL"></input>
        </form>
      </div>
      <div className="status-operations"><div className="sell-error"><p>{this.state.sell_status}</p></div></div>
      <div className="status-operations">
        <div className="sell-invoice">
          <p>{this.state.stock_sell}<span className="width-p5em">{this.state.stock_sell != "" && <span> (${this.props.stocksPrice[this.state.selected]})<span> x</span></span>}</span><span className="width-p5em">{this.state.stock_sell != "" && <span>{this.state.sell_qty}</span>}<span className="width-p5em">{this.state.stock_sell != "" && <span> = <span>${this.props.stocksPrice[this.state.selected] * this.state.sell_qty}</span></span>}</span></span></p>
        </div>
      </div>
    </div>
  </div>);
}
}
