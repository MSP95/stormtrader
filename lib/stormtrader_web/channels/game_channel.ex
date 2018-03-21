defmodule StormtraderWeb.GameChannel do
  alias StormtraderWeb.GameServer
  alias Stormtrader.Accounts
  alias Stormtrader.Accounts.User
  alias StormtraderWeb.ChannelMonitor
  use StormtraderWeb, :channel


  # /////////////////////////////////////////////////////////////////////////

  # Join function for Lobby channel
  def join("games:lobby",_params,socket) do
    gamelist0 = ChannelMonitor.games_list()
    |> Enum.map(fn{k, v} ->
      v = Enum.map(v, fn(user) -> user.name end)
      {k, v}
    end)
    |> Enum.into(%{})
    {:ok, %{ game_list: gamelist0}, socket}
  end

  # /////////////////////////////////////////////////////////////////////////

  # Join function for game channel
  def join("games:" <> game_id,_params, socket) do
    current_user = socket.assigns.current_user
    users = ChannelMonitor.user_joined("games:" <> game_id, current_user)["games:" <> game_id]
    GameServer.new(get_usernames(users), game_id)
    send self,{:after_join, users, game_id}
    send self, :after_join_lobby
    {:ok, %{ users: get_usernames(users) }, socket}
  end
  def handle_in("get_state", payload, socket) do
    %{"game_id" => game_id} = payload
    payload = GameServer.get_state(game_id)
    {:reply, {:ok, %{"gamestate"=> payload}}, socket}
  end

  def terminate(_reason, socket) do

    "games:" <> game_id = socket.topic
    user_id = socket.assigns.current_user.id
    if game_id == "lobby" do
    else
      users = ChannelMonitor.user_left("games:" <> game_id, user_id)["games:" <> game_id]
      state_update(socket, users, game_id)
      lobby_update(socket)
    end

    {:ok, socket}
  end
  def handle_info({:after_join, users, game_id}, socket) do
    state_update(socket, users, game_id)
    {:noreply, socket}
  end
  defp state_update(socket, users, game_id) do
    gamestate = GameServer.get_state(game_id)
    broadcast! socket, "state_update", %{ gamestate: gamestate }
  end
  def handle_info(:after_join_lobby, socket) do
    lobby_update(socket)
    {:noreply, socket}
  end
  def lobby_update(socket) do
    gamelist = ChannelMonitor.games_list()
    |> Enum.map(fn{k, v} ->
      v = Enum.map(v, fn(user) -> user.name end)
      {k, v}
    end)
    |> Enum.into(%{})

    StormtraderWeb.Endpoint.broadcast "games:lobby", "lobby_update", %{game_list: gamelist}
  end

  defp get_usernames(nil), do: []
  defp get_usernames(users) do
    Enum.map users, &(&1.id)
  end


  # /////////////////////////////////////////////////////////////////////////
  # chat module
  def handle_in("new_chat_send", payload, socket) do
     %{"body" => msg, "user"=> current_user} = payload
     user = Accounts.get_user(current_user).name
     IO.inspect user
    broadcast! socket, "new_chat_receive", %{body: msg, user: user}
    {:reply, {:ok, %{body: msg, user: user}}, socket}
  end
  # /////////////////////////////////////////////////////////////////////////




























end
