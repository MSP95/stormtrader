import React from 'react';
import ReactDOM from 'react-dom';

export default class OtherPlayer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(<div className="otherplayer">
    <div className="header">
      <h5>Other Player Owns</h5>
    </div>
    <div className="subheader">
      Wallet : ${this.props.player.wallet}
    </div>
    <div className="otherplayer-block">
    <table className="otherplayer-table">
      <tbody>
      <tr className="spaceunder"><td className="tdspace">Name</td><td className="tdspace">Qty.</td><td className="tdspace">Price</td></tr>
      {this.props.player.own.map((data) => {
        return(<tr className="spaceunder" key={data.id}><td className="tdspace">{data.stock_name}</td><td className="tdspace">{data.qty}</td><td className="tdspace">{data.bought_at}</td></tr>)
      })}
    </tbody>
  </table>
</div>
</div>);
  }
}
