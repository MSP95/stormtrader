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
    <div className="otherplayer-table">
      <div>
      {this.props.player.own.map((data) => {
        return(<tr key={data.id}><td>{data.name}</td><td>{data.qty}</td><td>{data.bought_at}</td></tr>)
      })}
  </div>
  </div>
</div>);
  }
}
