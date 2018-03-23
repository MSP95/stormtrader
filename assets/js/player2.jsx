import React from 'react';
import ReactDOM from 'react-dom';

export default class Player2 extends React.Component {
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
      sum = sum + owned["qty"] * stocks_price[owned.stock_id]
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
    <div className="subheader">Current Market Worth : {this.state.sum}</div>
    <div className="account-block">
      <table className="account-table">
        <tbody>
        <tr><td className="tdspace">Name</td><td className="tdspace">Qty.</td><td className="tdspace">Price</td></tr>
        {this.state.own.map((data) => {
          return(<tr key={data.id}><td className="tdspace">{data.stock_name}</td><td className="tdspace">{data.qty}</td><td className="tdspace">{data.bought_at}</td></tr>)
        })}
      </tbody>
      </table>
    </div>
  </div>)
}
}
