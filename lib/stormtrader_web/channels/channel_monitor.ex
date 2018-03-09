defmodule StormtraderWeb.ChannelMonitor do
  use GenServer

  def start_link(initial_state) do

    GenServer.start_link(__MODULE__, initial_state, name: __MODULE__)
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
  def handle_call({:user_joined, channel, user}, _from, state) do
    # IO.inspect "---------------STATE------------------"
    # IO.inspect state
    # IO.inspect "-----------------CHANNEL--------------"
    # IO.inspect channel
    new_state = case Map.get(state, channel) do
      nil ->
        Map.put(state, channel, [user])
        users ->
          Map.put(state, channel, Enum.uniq([user | users]))
        end
        # IO.inspect "-----------------NEW_STATE------------"
        # IO.inspect new_state
        {:reply, new_state, new_state}
      end

      def handle_call({:users_in_channel, channel}, _from, state) do
        {:reply, Map.get(state, channel), state}
      end
      def handle_call(:games_list, _from, state) do
        {:reply, state, state}

      end
      def handle_call({:user_left, channel, user_id}, _from, state) do
        new_users = state
        |> Map.get(channel)
        |> Enum.reject(&(&1.id == user_id))
        if Enum.empty?(new_users) do
          new_state = Map.delete(state, channel)
        else
          new_state = Map.update!(state, channel, fn(_) -> new_users end)
        end
        {:reply, new_state, new_state}
      end
    end
