defmodule StormtraderWeb.GameServer do
  use GenServer
  def new(player1, users, game_id) do

    initial_state = %{
      status: "ready",
      id: game_id,
      users: [],
      player1: nil,
      player2: nil,
      timer: 300,
      stocks_qty: Enum.take_random(1..100, 15),
      # stocks: Enum.take_random(1..100, 10),
    }
    game_id = String.to_atom(game_id)
    start_link(initial_state, game_id)


  end
  def addnew(current_user, users, game_id) do
    game_id0 = String.to_atom(game_id)
    user_joined(current_user, users, game_id0)
    start_timer(game_id0)
  end

  def user_joined(current_user, users, game_id) do
    GenServer.call(game_id, {:user_joined, current_user, users, game_id})

  end

  def start_link(initial_state, name) do
    GenServer.start_link(__MODULE__, initial_state, name: name)
  end
  def get_state(game_id) do
    game_id = String.to_atom(game_id)
    GenServer.call(game_id, {:get_state})
  end

  def start_timer(game_id) do
    GenServer.call(game_id, {:timer})
  end

  def buy(payload, game_id) do
    game_id = String.to_atom(game_id)
    GenServer.call(game_id, {:buy, payload})
  end
  # /////////////////////////////////////////////////////////////////////////////

  # GenServer implementation
  def handle_call({:buy, payload}, _from, state) do
    amount = payload["own"]["bought_at"]*payload["own"]["qty"]
    IO.inspect payload["own"]["stock_id"]
    available_qty = Enum.at(state.stocks_qty, payload["own"]["stock_id"])
    if payload["own"]["qty"] <= available_qty do
      #////////////////////////////////////////////////////////////////////////
      if payload["player"] == 1 do

        if state.player1.wallet >= amount do
          state = put_in(state.player1.own, state.player1.own++[payload["own"]])
          state = put_in(state.player1.wallet, state.player1.wallet-amount)
          new_list = List.replace_at(state.stocks_qty, payload["own"]["stock_id"], available_qty-payload["own"]["qty"])
          state = Map.replace!(state, :stocks_qty, new_list)
          status = "successfull"
        else
          status = "Not enough money"
        end
      else
        if state.player2.wallet >= payload["own"]["bought_at"]*payload["own"]["qty"] do
          state = put_in(state.player2.own, state.player2.own++[payload["own"]])
          state = put_in(state.player2.wallet, state.player2.wallet-amount)
          new_list = List.replace_at(state.stocks_qty, payload["own"]["stock_id"], available_qty-payload["own"]["qty"])
          state = Map.replace!(state, :stocks_qty, new_list)
          status = "successfull"
        else
          status = "Not enough money"
        end
      end
    else
      status = "No stocks left"
      #////////////////////////////////////////////////////////////////////////
    end

    IO.inspect state
    {:reply, %{status: status, gamestate: state}, state}
  end
  def handle_call({:user_joined,current_user, users, game_id}, _from, state) do
    IO.inspect state
    new_state = Map.replace!(state, :users, users)
    if new_state.player1 == nil do
      new_state = Map.replace!(new_state, :player1, %{user_id: current_user, wallet: 1000, own: []})
    else
      if new_state.player2 == nil do
        new_state = Map.replace!(new_state, :player2, %{user_id: current_user, wallet: 1000, own: []})
      end
    end
    {:reply, new_state, new_state}
  end

  def handle_call({:get_state}, _from, state) do
    {:reply, state, state}
  end

  def handle_info({:work}, state) do
    if (state.timer == 0) do
    else
      time = state.timer-1
      state = Map.replace!(state, :timer, time)
      timerx = Process.send_after(self(), {:work}, 1000)
    end
    # IO.inspect state

    StormtraderWeb.Endpoint.broadcast! "games:"<>state.id, "start_timer", %{time: time}
    {:noreply, state}
  end

  def handle_call({:timer}, _from, state) do
    # IO.inspect state
    if state.status == "ready" and state.player1 != nil and state.player2 != nil do
      state = Map.replace!(state, :status, "started")
      timerx = Process.send_after(self(), {:work}, 1000) # In 2 hours
    end
    {:reply, state, state}
  end
  # /////////////////////////////////////////////////////////////////////////////
end
