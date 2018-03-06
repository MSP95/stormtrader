defmodule StormtraderWeb.PageController do
  use StormtraderWeb, :controller

  def index(conn, _params) do
    render conn, "login.html"
  end
  def home(conn, _params) do
    render conn, "home.html"
  end
end
