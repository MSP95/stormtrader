defmodule StormtraderWeb.PageController do
  use StormtraderWeb, :controller
  alias StormtraderWeb.TokenGenerator
  alias StormtraderWeb.ChannelMonitor
  alias StormtraderWeb.GameServer
  def index(conn, _params) do
    render conn, "login.html"
  end
  def home(conn, _params) do
    state = ChannelMonitor.games_list()

    render(conn, "home.html", game_list: state)
  end
  def create(conn, _params) do
    current_user = conn.assigns[:current_user]
    {:ok, game_id} = TokenGenerator.new()
    GameServer.new(current_user.id, [], game_id)
    redirect conn, to: "/games/#{game_id}"
  end
  def leaderboard(conn,_params) do
    leaderboard = Stormtrader.Accounts.get_leaders()
    render(conn, "leaderboard.html", leaderboard: leaderboard)
  end

  def show(conn, %{"game_id" => game_id}) do
    conn
    |> render("game_page.html", %{game_id: game_id})
  end
end
