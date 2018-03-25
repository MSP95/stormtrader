
defmodule StormtraderWeb.GameServer do
  alias StormtraderWeb.ChannelMonitor
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

  def user_left(users, current_user, game_id) do
    game_id = String.to_atom(game_id)
    GenServer.call(game_id, {:user_left,users, current_user, game_id})
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
  def sell(payload, game_id) do
    game_id = String.to_atom(game_id)
    GenServer.call(game_id, {:sell, payload})
  end
  def stopp(game_id) do
    game_id = String.to_atom(game_id)

    GenServer.stop(game_id, :normal, :infinity)
    # Process.send_after(self(), {:stopp, game_id}, 1000)
  end

  # /////////////////////////////////////////////////////////////////////////////

  def handle_info({:stopp, game_id}, _from, state) do
    # IO.inspect "***********stopped***********"
    # GenServer.stop(game_id, :normal, :infinity)
    {:noreply, state}
  end
  # GenServer implementation
  def handle_call({:buy, payload}, _from, state) do
    amount = payload["own"]["bought_at"]*payload["own"]["qty"]
    available_qty = Enum.at(state.stocks_qty, payload["own"]["stock_id"])
    if payload["own"]["qty"] <= available_qty &&  payload["own"]["qty"] > 0 do
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

    {:reply, %{status: status, gamestate: %{player1: state.player1, player2: state.player2, stocks_qty: state.stocks_qty}}, state}
  end

  def handle_call({:sell, payload}, _from, state) do
    status = "success"
    available_qty = Enum.at(state.stocks_qty, payload["own"]["stock_id"])
    # /////////////////////////////////////////////////////////////////////////////
    if payload["player"] == 1 do
      sellQuant = payload["own"]["qty"]
      shares = state.player1.own
      owned_quantity = Enum.reduce(shares, 0, fn(own, acc)->
        if own["stock_id"] == payload["own"]["stock_id"] do
          acc+own["qty"]
        else
          acc
        end
      end)
      IO.inspect owned_quantity
      IO.inspect sellQuant
      if owned_quantity >= sellQuant && sellQuant > 0 do
        shares = shares
        |> Enum.reduce(%{qty: sellQuant, s: []}, fn(own, acc)->
          # filtering required stocks
          if own["stock_id"] == payload["own"]["stock_id"] do
            if own["qty"]>= acc.qty do
              own = put_in(own["qty"], own["qty"]-acc.qty)
              if own["qty"] == 0 do
                %{qty: 0, s: acc.s}
              else
                %{qty: 0, s: acc.s ++ [own]}
              end
            else
              %{qty: acc.qty - own["qty"], s: acc.s}
            end
          else
            %{qty: acc.qty, s: acc.s ++ [own]}
          end
        end)
        state = put_in(state.player1.own, shares.s)
        state = put_in(state.player1.wallet, state.player1.wallet+(sellQuant*payload["own"]["sold_at"]))
        new_list = List.replace_at(state.stocks_qty, payload["own"]["stock_id"], available_qty+payload["own"]["qty"])
        state = Map.replace!(state, :stocks_qty, new_list)
      else
        status = "Invalid Quantity"
      end
    end
    # /////////////////////////////////////////////////////////////////////////////
    if payload["player"]==2 do
      shares = state.player2.own
      sellQuant = payload["own"]["qty"]
      owned_quantity = Enum.reduce(shares, 0, fn(own, acc)->
        if own["stock_id"] == payload["own"]["stock_id"] do
          acc+own["qty"]
        else
          acc
        end
      end)
      if owned_quantity >= sellQuant && sellQuant > 0 do
        shares = shares
        |> Enum.reduce(%{qty: sellQuant, s: []}, fn(own, acc)->
          # filtering required stocks
          if own["stock_id"] == payload["own"]["stock_id"] do
            if own["qty"]>= acc.qty do
              own = put_in(own["qty"], own["qty"]-acc.qty)
              if own["qty"] == 0 do
                %{qty: 0, s: acc.s}
              else
                %{qty: 0, s: acc.s ++ [own]}
              end
            else
              %{qty: acc.qty - own["qty"], s: acc.s}
            end
          else
            %{qty: acc.qty, s: acc.s ++ [own]}
          end
        end)
        state = put_in(state.player2.own, shares.s)
        state = put_in(state.player2.wallet, state.player2.wallet+(sellQuant*payload["own"]["sold_at"]))
        new_list = List.replace_at(state.stocks_qty, payload["own"]["stock_id"], available_qty+payload["own"]["qty"])
        state = Map.replace!(state, :stocks_qty, new_list)
      else
        status = "Invalid Quantity"
      end
    end
    # /////////////////////////////////////////////////////////////////////////////
    {:reply, %{status: status, gamestate: %{player1: state.player1, player2: state.player2, stocks_qty: state.stocks_qty}}, state}
  end
  def handle_call({:user_joined,current_user, users, game_id}, _from, state) do
    new_state = Map.replace!(state, :users, users)
    if new_state.player1 == nil do
      new_state = Map.replace!(new_state, :player1, %{user_id: current_user, wallet: 10000, own: []})
    else
      if new_state.player2 == nil do
        new_state = Map.replace!(new_state, :player2, %{user_id: current_user, wallet: 10000, own: []})
      end
    end
    {:reply, new_state, new_state}
  end

  def handle_call({:user_left,users, user_id, game_id}, _from, state) do
    state = Map.replace!(state, :users, users)
    if state.player1 == nil || state.player2 == nil do
      # Process.send_after(self(), {:stopp, game_id}, 800)
      winner = "no one"
    else
      if user_id == state.player1.user_id do
        winner = state.player2.user_id
        # state = put_in(state.player1.user_id, nil)
        state = Map.replace!(state, :status, "stopped")
        # Process.send_after(self(), {:stopp, game_id}, 800)

      end
      if user_id == state.player2.user_id do
        winner = state.player1.user_id
        # state = put_in(state.player2.user_id, nil)
        state = Map.replace!(state, :status, "stopped")
        # Process.send_after(self(), {:stopp, game_id}, 800)
        # GenServer.stop(game_id, "user left abruptly", :infinity)
      end
    end

    {:reply, %{state: state, winner: winner}, state}
  end

  def handle_call({:get_state}, _from, state) do
    {:reply, state, state}
  end

  def handle_info({:work}, state) do
    if (state.timer == 0) do
      if (state.status != "stopped") do
        state = Map.replace!(state, :status, "stopped")
        ChannelMonitor.delete_game("games:" <> state.id)
        gamelist = ChannelMonitor.games_list()
        |> Enum.map(fn{k, v} ->
          v = Enum.map(v, fn(user) -> user.name end)
          {k, v}
        end)
        |> Enum.into(%{})

        StormtraderWeb.Endpoint.broadcast "games:lobby", "lobby_update", %{game_list: gamelist}
        if state.player1.wallet>state.player2.wallet do
          winner = state.player1.user_id
        else
          winner = state.player2.user_id
        end
        if state.player1.wallet==state.player2.wallet, do: winner= "tie"
        StormtraderWeb.Endpoint.broadcast! "games:"<>state.id, "state_update", %{ gamestate: state, winner: winner}
        # game_id_atom = String.to_atom(state.id)
        # Process.send_after(self(), {:stopp, game_id_atom},200)
      end

    else
      time = state.timer-1
      state = Map.replace!(state, :timer, time)
      timerx = Process.send_after(self(), {:work}, 1000)
    end
    StormtraderWeb.Endpoint.broadcast! "games:"<>state.id, "start_timer", %{time: time}
    {:noreply, state}
  end

  def handle_call({:timer}, _from, state) do
    if state.status == "ready" and state.player1 != nil and state.player2 != nil do
      state = Map.replace!(state, :status, "started")
      timerx = Process.send_after(self(), {:work}, 1000) # In 2 hours
    end
    {:reply, state, state}
  end


  # /////////////////////////////////////////////////////////////////////////////
end
