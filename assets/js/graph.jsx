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
      {id: 2, name: "BABA"},
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
        label.push(label[label.length - 1] + 5)
        this.setState({historic: historic, labels: label})
      });
    }

  // componentWillReceiveProps(newProps) {
  //   if(newProps.stocksPrice != this.props.stocksPrice) {
  //     let historic = this.state.historic.slice(0)
  //     // for(let i = 0; i < this.props.stocksPrice.length; i++) {
  //     //   historic[i].push(this.props.stocksPrice[i])
  //     // }
  //     // for(let i = 0; i < 15; i++) {
  //     //
  //     // }
  //     let newdata = []
  //     for(let i = 0; i < 15; i++) {
  //       let hist = historic[i]
  //       console.log("every",hist)
  //       // hist.push(this.props.stocksPrice[i])
  //       // newdata.push(hist)
  //     }
  //     // console.log(newdata)
  //     //this.setState({historic: historic})
  //   }
    //let stocks = this.state.stocks;
    // let currentPrice = newProps.stocksPrice
    // let historic = this.state.historic.slice(0)
    // console.log("CurrentPrice", currentPrice)
    // for(let i = 0; i < currentPrice.length; i++) {
    //   historic[i].push(currentPrice[i])
    // }
    // this.setState({historic: historic})
  //}

  // componentDidMount() {
  //   setInterval(() => {
  //     let historic = this.state.historic.slice(0)
  //     for(let i = 0; i < this.props.stocksPrice.length; i++) {
  //       //historic[i].push(this.props.stocksPrice[i])
  //       console.log(i,historic[i])
  //     }
  //     this.setState({historic: historic})
  //   }, 7000)
  // }

    //stocks.datasets[0].data.push(currentPrice[0])
    //this.setState({stocks: stocks})
    //console.log(stocks.labels[stocks.labels.length - 1])
    // for(let i = 0; i < currentPrice.length; i++) {
    //   stocks.datasets[i].data.push(currentPrice[i])
    // }
    // stocks.labels.push(stocks.labels[stocks.labels.length - 1] + 5)
    // this.setState({stocks: stocks})
    // console.log(this.state.stocks)
    //stocks.datasets[0].data.push(zero)
    //console.log(stocks)


  getChart(event) {
    event.preventDefault();
    let value = parseInt(event.target.value)
    let data = this.state.names[value]
    let chartData = {labels: this.state.labels, datasets: [{data: this.state.historic[value], label: this.state.names[value].name}]}
    this.setState({stocks: chartData})
  }

  render() {
    return(<div className="graph">
    <div className="subheader">
      <h5>Graph</h5>
    </div>
    <select onChange={this.getChart}>{this.state.names.map((data) => {
        return(<option key={data.id} value={data.id}>{data.name}</option>)
      })}</select>
    <Line data={this.state.stocks} redraw={true}/>
    </div>)
  }
}
