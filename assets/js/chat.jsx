import React from 'react';
import ReactDOM from 'react-dom';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      msgs: [],
      current_msg: "",
    }
  }

  handleChange(event){
    let input = event.target.value
    this.setState({current_msg: input})
  }

  handleSubmit(event) {
    this.refs.chatinput.value = "";
    this.channel.push("new_chat_send", {body: this.state.current_msg, user: current_user })
    event.preventDefault();
  }

  componentDidMount(){
    let messagesContainer = $("#chatbox")
    this.channel.on("new_chat_receive", payload => {
      let messageItem = `[${payload.user}] ${payload.body}`
      this.setState({msgs: this.state.msgs.concat([messageItem])})
    })
  }

  render() {
    return(
      <div className="chat-block">
        <div className="header"><h5>Chat</h5></div>
          <div>
            {this.state.msgs.map(function(comp,i){
              return <div key={'msg' + i}>{comp}</div>
            })}
          </div>
          <form onSubmit={this.handleSubmit} className="chat-inputs">
          <div className="input-group">
            <input type="text" ref="chatinput" onChange={this.handleChange} className="form-control" id="input-box"
              placeholder="Write a msg."
              required />
            <input type="submit" className="btn btn-success" value = "send"/>
          </div>
        </form>
      </div>);
    }
  }
