import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.channel = this.props.channel;
    this.getChart = this.getChart.bind(this)
    this.state = {
      names: [{id: 0, name: "AMZN"},
      {id:1, name: "APPL"},
      {id:2, name: "BABA"},
      {id:3, name: "CSCO"},
      {id:4, name: "FB"},
      {id:5, name: "GOOG"},
      {id:6, name: "GPRO"},
      {id:7, name: "IBM"},
      {id:8, name: "INTC"},
      {id:9, name: "MSFT"},
      {id:10, name: "NVDA"},
      {id:11, name: "ORCL"},
      {id:12, name: "SNAP"},
      {id:13, name: "TSLA"},
      {id:14, name: "VZ"}],
      historic: [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
      labels: [0],
      stocks: {
        labels:[],
        datasets: [
          {data: [], label: "AMZN"}]
        }
      }
    }

    componentDidMount() {
      //Place socket.on call here
      this.channel.on('get_stocks', (response) => {
        let historic = this.state.historic
        let stocks = response.stocks
        let label = this.state.labels
        for(let i = 0; i < stocks.length; i++) {
          historic[i].push(stocks[i])
        }
        label.push(label[label.length - 1] + 7)
        this.setState({historic: historic, labels: label})
      });
    }

    getChart(event) {
      event.preventDefault();
      let value = parseInt(event.target.value)
      let data = this.state.names[value]
      let chartData = {labels: this.state.labels, datasets: [{data: this.state.historic[value], label: this.state.names[value].name}]}
      this.setState({stocks: chartData})
    }


    render() {
      return(<div className="graph">
      <div className="header">
        <h5>Graph</h5>
      </div>
      <div>
        <select className="custom-select custom-select-sm graph-selector" onChange={this.getChart}>{this.state.names.map((data) => {
            return(<option key={data.id} options={{events: ['click']}} value={data.id}>{data.name}</option>)
          })}</select>
        </div>
        <div>
          <Line data={this.state.stocks} />
        </div>
      </div>)
    }
  }
