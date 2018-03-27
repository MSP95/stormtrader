defmodule StormtraderWeb.Router do
  use StormtraderWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug SessionUserFetcher
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", StormtraderWeb do
    pipe_through :browser # Use the default browser stack
    resources "/users", UserController
    get "/", PageController, :index
    get "/home", PageController, :home
    post "/session", SessionController, :create
    delete "/session", SessionController, :delete
    post "/", PageController, :create
    get "/games/:game_id", PageController, :show
    get "/leaderboard", PageController, :leaderboard
  end

  # Other scopes may use custom stacks.
  # scope "/api", StormtraderWeb do
  #   pipe_through :api
  # end
end
