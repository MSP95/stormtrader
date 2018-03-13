defmodule StormtraderWeb.GameServer do
  use GenServer
  def new(users, game_id) do

    initial_state = %{
      status: "ready",
      id: game_id,
      users: [],
      timer: 300,
      # stocks: Enum.take_random(1..100, 10),
    }
    game_id = String.to_atom(game_id)
    if length(users) == 1 do
      start_link(initial_state, game_id)
      user_joined(users, game_id)
    else
      user_joined(users, game_id)
      start_timer(game_id)
      # send_stocks(game_id)
    end
  end

  def user_joined(users, game_id) do
    GenServer.call(game_id, {:user_joined, users, game_id})

  end

  def start_link(initial_state, name) do
    GenServer.start_link(__MODULE__, initial_state, name: name)
  end
  def get_state(game_id) do
    game_id = String.to_atom(game_id)
    GenServer.call(game_id, {:get_state})
  end
  # def send_stocks(game_id) do
  #   GenServer.call(game_id, {:send_stocks})
  # end
  def start_timer(game_id) do

    GenServer.call(game_id, {:timer})
  end
  def handle_info({:work}, state) do
    if (state.timer == 0) do
    else
      time = state.timer-1
      state = Map.replace!(state, :timer, time)
      timerx = Process.send_after(self(), {:work}, 1000)
    end

    StormtraderWeb.Endpoint.broadcast! "games:"<>state.id, "start_timer", %{time: time}

    {:noreply, state}
  end
  def handle_call({:timer}, _from, state) do
    if state.status == "ready" do
      state = Map.replace!(state, :status, "started")
      timerx = Process.send_after(self(), {:work}, 1000) # In 2 hours
    end
    {:reply, state, state}
  end
# /////////////////////////////////////////////////////////////////////////////
  # GenServer implementation
  def handle_call({:user_joined, users, game_id}, _from, state) do
    new_state = Map.replace!(state, :users, users)

    {:reply, new_state, new_state}
  end
  def handle_call({:get_state}, _from, state) do
    {:reply, state, state}
  end


end
