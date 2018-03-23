import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stocks: {
        labels:[0],
        datasets: [
          {data: [], label: "AMZN"}]
        }
      }
    }

    componentWillReceiveProps(newProps) {
      let stocks = this.state.stocks;
      let currentPrice = newProps.stocksPrice
      stocks.datasets[0].data.push(currentPrice[0])
      this.setState({stocks: stocks})
      //console.log(stocks.labels[stocks.labels.length - 1])
      // for(let i = 0; i < currentPrice.length; i++) {
      //   stocks.datasets[i].data.push(currentPrice[i])
      // }
      // stocks.labels.push(stocks.labels[stocks.labels.length - 1] + 5)
      // this.setState({stocks: stocks})
      // console.log(this.state.stocks)
      //stocks.datasets[0].data.push(zero)
      //console.log(stocks)

    }

    render() {
      return(<div className="graph">
      <div className="subheader">
        <h5>Graph</h5>
      </div>
      <Line data={this.state.stocks} />
    </div>)
  }
}
