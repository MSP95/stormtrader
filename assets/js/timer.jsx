import React from 'react';
import ReactDOM from 'react-dom';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      timer: "",
    }
  }

  componentDidMount() {
    this.channel.on('start_timer', (response) => {
      //console.log(response.time);
      let minutes = Math.floor(response.time / 60);
      let seconds = response.time - minutes * 60;
      let time_left = minutes+" : "+seconds;
      this.setState({timer: time_left});
    });
  }

  render() {
    return(<div className="timer">{this.state.timer}</div>)
  }
}
