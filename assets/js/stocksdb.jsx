import React from 'react';
import ReactDOM from 'react-dom';

export default class StocksDB extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(<div className="stocksdb">
      <div className="header">
      <h5>Stocks Available</h5>
      </div>
    </div>)
  }
}
