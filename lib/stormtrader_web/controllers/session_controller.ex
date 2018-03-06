defmodule StormtraderWeb.SessionController do
  use StormtraderWeb, :controller

  alias Stormtrader.Accounts
  alias Stormtrader.Accounts.User

  def create(conn, %{"name" => name}) do
    user = Accounts.get_user_by_name(name)
    if user do
      conn
      |> put_session(:user_id, user.id)
      |> put_flash(:info, "Welcome back #{user.name}")
      |> redirect(to: page_path(conn, :home))
    else
      conn
      |> put_flash(:error, "Can't create session, Invalid username.")
      |> redirect(to: page_path(conn, :index))
    end
  end

  def delete(conn, _params) do
    conn
    |> delete_session(:user_id)
    |> put_flash(:info, "Logged out successfully")
    |> redirect(to: page_path(conn, :index))
  end
end
