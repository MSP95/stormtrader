defmodule StormtraderWeb.GameChannel do
  @moduledoc """
  The interface between the browser and the GameServer.
  """
  alias StormtraderWeb.ChannelMonitor
  use StormtraderWeb, :channel

  alias Stormtrader.GameServer

  def join("games:" <> game_id,_params, socket) do
    current_user = socket.assigns.current_user
    users = ChannelMonitor.user_joined("game:" <> game_id, current_user)["game:" <> game_id]
    send self,{:after_join, users}
    {:ok, socket}
  end
  def handle_in("get_state", payload, socket) do
    %{"game_id" => game_id} = payload
    payload = ChannelMonitor.users_in_channel("game:" <> game_id)
    |> Enum.map(fn(user) -> %{user.id => user.name} end)
    IO.inspect "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    IO.inspect payload
    {:reply, {:ok, %{"gamestate"=> payload}}, socket}
  end

  def terminate(_reason, socket) do
    "games:" <> game_id = socket.topic
    user_id = socket.assigns.current_user.id
    users = ChannelMonitor.user_left("game:" <> game_id, user_id)["game:" <> game_id]
    lobby_update(socket, users)
    {:ok, socket}
  end
  def handle_info({:after_join, users}, socket) do
    lobby_update(socket, users)
    {:noreply, socket}
  end
  defp lobby_update(socket, users) do
    # gamelist_update()
    broadcast! socket, "lobby_update", %{ users: get_usernames(users) }
  end
  # def games_list() do
  #   ChannelMonitor.games_list()
  # end
  defp get_usernames(nil), do: []
  defp get_usernames(users) do
    Enum.map users, &(&1.name)
  end
  def new() do
    game_id = generate_token(8)
    {:ok, game_id}
  end

  def generate_token(n) do
    n
    |> :crypto.strong_rand_bytes
    |> Base.encode16(case: :lower)
  end
  # def list_all_games() do
  #   Supervisor.which_children(:game_register)
  #   |> Enum.map(fn {_,account_proc_pid, _, _} ->
  #     Registry.keys(:game_register, account_proc_pid)
  #
  #   end)update
  # end
end
