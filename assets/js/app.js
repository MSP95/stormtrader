// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"
import game_init from "./game";
const game_id = window.game_id
const current_user = window.current_user
// const game_container = document.getElementById('game_container')




function start_game(){
  if (current_user){socket.connect()}
  if (game_id && current_user) {
    const channel = socket.channel('games:' + game_id)
    channel.on('lobby_update', function(response) {
      console.log(JSON.stringify(response.users));
      $(get_state(channel))
    });
    channel.join()
    .receive('ok', resp => {
      console.log(current_user + ' Joined game ' + game_id, resp)
      $(get_state(channel))
      // ReactDOM.render(<Game id={game_id} channel={channel} />, game_container)
    })
    .receive('error', resp => {
      if (resp.reason == 'in_progress') {
        game_container.innerHTML = 'You cannot join a game already in progress.'
      } else {
        game_container.innerHTML = 'An unexpected error occurred. Please try refreshing.'
      }
    })
  }
}
function get_state(channel){
  channel.push("get_state", {game_id: game_id,}).receive("ok", function(resp){
    if(game_id){
      // let channel = socket.channel("games:"+window.gameName, {});

      game_init(resp, channel);
      console.log(resp);
    });
  }

  function leave_game(){
    const channel = socket.channel('games:' + game_id)
    channel.leave()
    .receive('ok', resp => {
      console.log(current_user + ' Left game ' + game_id, resp)
      $(get_state(channel))
      // ReactDOM.render(<Game id={game_id} channel={channel} />, game_container)
    })
    channel.on('lobby_update', function(response) {
      console.log(JSON.stringify(response.users));
    });
  }
  function end_game() {
    if(!$('.end_game')) {
      return;
    }
    $(".end_game").click(leave_game);
  }
  function maintain_gamelist(){
    // let gamelist =
  }
  $(end_game)
  $(start_game)
  $(maintain_gamelist)
