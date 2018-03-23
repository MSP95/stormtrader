import React from 'react';
import ReactDOM from 'react-dom';

export default class Account extends React.Component {
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
      <div className="account-table">
        {this.state.own.map((data) => {
          return(<tr key={data.id}><td>{data.name}</td><td>{data.qty}</td><td>{data.bought_at}</td></tr>)
        })}
      </div>
    </div>
  </div>)
}
}
