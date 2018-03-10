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
// const game_list = document.getElementById('game_list')
// ///////////////////////////////////////////////////////////////////////////

function start_game(){
  // $(".game_list").append("<li>jdfhsdfhksj</li>");
  if (current_user){
    socket.connect()
    let lobby = socket.channel('games:lobby')
    lobby.join().receive('ok', resp => {
      console.log('joined lobby');
      let html = ""
      $.each(resp.game_list, function (index1, item1) {
        html += "<li>" + item1 + "</li>";

      });
      $(".game-list").empty().append(html);

      $(lobby_listener(lobby))
    })
  }
  if (game_id && current_user) {
    const channel = socket.channel('games:' + game_id)
    // join channel
    channel.join()
    .receive('ok', resp => {
      console.log(current_user + ' Joined game ' + game_id, resp)
      $(change_listener(channel))
    })
    .receive('error', resp => {
      if (resp.reason == 'in_progress') {
        game_container.innerHTML = 'You cannot join a game already in progress.'
      } else {
        game_container.innerHTML = 'An unexpected error occurred. Please try refreshing.'
      }})

    }
  }
  function get_state(channel, users){
    channel.push("get_state", {game_id: game_id,}).receive("ok", function(resp){
      if(game_id){
        game_init(resp, channel, users)
        // console.log(resp);
      }
    });
  }
  // ///////////////////////////////////////////////////////////////////////////
  function leave_game(){
    const channel = socket.channel('games:' + game_id)
    channel.leave()
    .receive('ok', resp => {
    })

  }
  function end_game() {
    if(!$('.end_game')) {
      return;
    }
    $(".end_game").click(leave_game);
  }
  function change_listener(channel){
    if (game_id && current_user){
      // const channel = socket.channel('games:' + game_id)
      channel.on('state_update', function(response) {
        console.log(JSON.stringify(response.users));
        if (response.users.length == 2){
          $(get_state(channel, response.users))
        }
      });}
    }
    function lobby_listener(lobby){
      //  const channel = socket.channel('games:' + game_id)
      lobby.on('lobby_update', function(resp) {
        console.log(resp);
        let html = ""
        $.each(resp.game_list, function (index1, item1) {
          html += "<li>" + item1 + "</li>";

        });
        $(".game-list").empty().append(html);
        // if (response.users.length == 2){
        // $(get_state(channel, response.users))
        // }
      });
    }

    // ///////////////////////////////////////////////////////////////////////////
    $(start_game)
    $(end_game)
