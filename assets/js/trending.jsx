import React from 'react';
import ReactDOM from 'react-dom';

export default class Trending extends React.Component {
  render() {
    let stocks_names = this.props.stocksNames
    let stocks_price = this.props.stocksPrice
    let stocks_quantity = this.props.stocksQty
    let old_stocks_price = this.props.stocksOldPrice
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
      <table className="trending-table">
        <tbody>
          {topFive.map((data) => {
            return(<tr className="spaceunder" key={data.id}><td className="tdspace">{data.name}</td><td className="tdspace">{data.price}</td><td className="tdspace">{data.change > 0 && <div className="arrow-up"></div>}{data.change < 0 && <div className="arrow-down"></div>}</td></tr>)
          })}
        </tbody>
      </table>
    </div>
  </div>);
}
}
