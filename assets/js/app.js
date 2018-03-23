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
import spectate_init from './spectate';
import lobby_init from "./lobby";
import wait_init from './waiting';
const game_id = window.game_id
const current_user = window.current_user
let classgamelist = document.getElementsByClassName("game-list")[0];
const gamecontainer = document.getElementById('game-container');
// const game_list = document.getElementById('game_list')
// ///////////////////////////////////////////////////////////////////////////

function start_game() {
  $(join_lobby())
  if (game_id && current_user) {
    const channel = socket.channel('games:' + game_id)
    // join channel
    channel.join()
    .receive("ok", resp => {
      console.log(current_user + ' Joined game ' + game_id, resp)
      $(change_listener(channel))
    });
  }
}
function join_lobby(){
  if (current_user) {
    socket.connect()
    let lobby = socket.channel('games:lobby')
    if (classgamelist){
      lobby_init(classgamelist, lobby);
    }
  }
}
function change_listener(channel) {
  if (game_id && current_user) {
    channel.on('state_update', function(response) {
      let p1 = response.gamestate.player1;
      let p2 = response.gamestate.player2;
      if (response.winner != null){
          console.log(response);
      }
      else{
        // console.log(JSON.stringify(response));
        if (p1!=null && p2!=null) {
          if (p1.user_id==current_user || p2.user_id==current_user){
            $(get_state(channel, response.gamestate.users))
          }
          else{
            $(spectate(channel, response.gamestate.users))
          }
        }
        else {
          wait_init(gamecontainer);
        }
      }
    });
  }
}
function spectate(channel, users) {
  channel.push("get_state", {
    game_id: game_id,
  }).receive("ok", function(state) {
    if (game_id) {
      spectate_init(gamecontainer, state, channel, users)
    }
  });
}
function get_state(channel, users) {
  channel.push("get_state", {
    game_id: game_id,
  }).receive("ok", function(state) {
    if (game_id) {
      game_init(gamecontainer, state, channel, users)
    }
  });
}
// ///////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////
$(start_game)
