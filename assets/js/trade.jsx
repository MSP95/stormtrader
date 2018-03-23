import React from 'react';
import ReactDOM from 'react-dom';

export default class Trade extends React.Component {
  constructor(props) {
    super(props);
    this.buyStock = this.buyStock.bind(this);
    this.sellStock = this.sellStock.bind(this);
    this.handleStockName = this.handleStockName.bind(this);
    this.handleStockQty = this.handleStockQty.bind(this);
    this.channel = this.props.channel;
    this.state = {
      stocks_array: [],
      stocks_qty: [],
      own: [],
      input_mismatch_error: "",
      stock_incart: "",
      symbols: [],
      stock_qty_incart: "",
      cart_total: "",
      stock_current_price: "",
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
    let stock_name = event.target.stock_name.value;
    let stock_quantity = event.target.stock_quantity.value;
    // TODO: VALIDATE NAME FIRST
    let stock_id = this.props.stocksNames.indexOf(stock_name)
    let buy_object = {stock_id: stock_id, stock_name: stock_name, qty: parseInt(stock_quantity), bought_at: this.props.stocksPrice[stock_id]}
    let player = this.props.playerNumber
    let send_object = {player: player, own: buy_object}
    this.channel.push("buy_request", {
      buy: send_object,
    })
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

  sellStock(event) {
    event.preventDefault();
    console.log(event)
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
          <select className="form-control">
            <option default>Select Stock</option>
            {this.state.own.map((data) => {
              return(<option key={data.id} value={data.id}>{data.name}</option>)
            })}
          </select>
          <input className="form-control" name="sell_quantity" type="number" placeholder="Quantity"></input>
          </div>
          <div className="height-p4em"></div>
          <input className="buy-btn btn-danger" type="submit" value="SELL"></input>
        </form>
      </div>
    </div>
  </div>);
}
}
