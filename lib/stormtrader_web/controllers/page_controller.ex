defmodule StormtraderWeb.PageController do
  use StormtraderWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
