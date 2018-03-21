defmodule StormtraderWeb.ChannelMonitor do
  use GenServer

  def start_link(initial_state) do

    initial_state0 = %{
      stock_price: Enum.take_random(50..1000, 15),
      channels: %{},
    }
    {stat, pid} = GenServer.start_link(__MODULE__, initial_state0, name: __MODULE__)
    if stat == :ok do
      # IO.inspect "sjkgfskjdsghkdjsfhdsljfkjhdkfhsfkljhflk"
      send_stocks()
    end
    {stat, pid}
    # Process.send_after(self(), send_stocks(), 5000)
  end

  def send_stocks() do
    GenServer.call(__MODULE__, {:send_stocks})
  end
  def user_joined(channel, user) do
    GenServer.call(__MODULE__, {:user_joined, channel, user})
  end

  def users_in_channel(channel) do
    GenServer.call(__MODULE__, {:users_in_channel, channel})
  end

  def games_list() do
    GenServer.call(__MODULE__, :games_list)
  end
  def user_left(channel, user_id) do
    GenServer.call(__MODULE__, {:user_left, channel, user_id})
  end

  # GenServer implementation
  # ////////////////////////////////////////////////////////////////////////////
  def handle_call({:send_stocks}, _from, state) do
    Process.send_after(self(), {:generate_stocks}, 3000) # In 2 hours
    {:reply, state, state}
  end
  def handle_info({:generate_stocks}, state) do
    Map.keys(state.channels)
    |> Enum.each(fn(channel) ->
      # IO.inspect channel
    StormtraderWeb.Endpoint.broadcast! channel, "get_stocks", %{stocks: state.stock_price}
     end)
    #IO.inspect state.stock_price
    state = Map.replace!(state, :stock_price, Enum.take_random(50..1000, 15))
    Process.send_after(self(), {:generate_stocks}, 3000)
    {:noreply, state}
  end
  # ////////////////////////////////////////////////////////////////////////////

  def handle_call({:user_joined, channel, user}, _from, state) do
    #IO.inspect "---------------STATE------------------"
    #IO.inspect state
    # IO.inspect "-----------------CHANNEL--------------"
    # IO.inspect channel
    new_channelist = case Map.get(state.channels, channel) do
      nil ->
        Map.put(state.channels, channel, [user])
        users ->
          Map.put(state.channels, channel, Enum.uniq([user | users]))
        end
        new_state = Map.replace!(state, :channels, new_channelist)
        #IO.inspect "-----------------NEW_STATE------------"
        #IO.inspect new_state
        {:reply, new_channelist, new_state}
      end

      def handle_call({:users_in_channel, channel}, _from, state) do
        {:reply, Map.get(state.channels, channel), state}
      end
      def handle_call(:games_list, _from, state) do
        {:reply, state.channels, state}

      end
      def handle_call({:user_left, channel, user_id}, _from, state) do
        new_users = state.channels
        |> Map.get(channel)
        |> Enum.reject(&(&1.id == user_id))
        if Enum.empty?(new_users) do
          new_channelist = Map.delete(state.channels, channel)
        else
          new_channelist = Map.update!(state.channels, channel, fn(_) -> new_users end)
        end
        new_state = Map.replace!(state, :channels, new_channelist)
        {:reply, new_channelist, new_state}
      end
    end
