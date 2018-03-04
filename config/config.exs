# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :stormtrader,
  ecto_repos: [Stormtrader.Repo]

# Configures the endpoint
config :stormtrader, StormtraderWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "LvmOyau4bysJufDSn8U3EJ+gyZPXdVSPAnCLdDPdx5l0eJ2nEh1eNDVlSIsYZ9f4",
  render_errors: [view: StormtraderWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Stormtrader.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
