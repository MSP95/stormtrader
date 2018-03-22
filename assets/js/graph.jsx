import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stocks: {
        labels:[5, 10, 15, 20],
        datasets: [{
          data: [100, 200, 300, 400],
          label: "Google",
        }]
      }
    }
  }

  componentWillReceiveProps(newProps) {
      // let google = this.state.stocks.datasets[0].data.push(newProps.stocksPrice[0])
      // let newdata = [{data: google, label: "Google"}]
      // // let data = this.state.stocks
      // // data.datasets[0].data = google
      // // this.setState({stocks: data})
      // let current = this.state.stocks;
      // current.datasets = newdata
      // this.setState({stocks: current})

  }

  render() {
    return(<div className="graph">
    <div className="subheader">
    <h5>Graph</h5>
    </div>
    <Line data={this.state.stocks}/>
  </div>)
}
}
