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
    IO.inspect state
    render(conn, "home.html", game_list: state)
  end
  def create(conn, _params) do
    current_user = conn.assigns[:current_user]
    {:ok, game_id} = TokenGenerator.new()
    GameServer.new([current_user.name], game_id)
    redirect conn, to: "/#{game_id}"
  end

  def show(conn, %{"game_id" => game_id}) do
    conn
    # |> put_layout("game.html")
    |> render("game_page.html", %{game_id: game_id})
  end
end
