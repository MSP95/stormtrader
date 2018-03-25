use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :stormtrader, StormtraderWeb.Endpoint,
  secret_key_base: "ZkV4PiN1SYVT4ryd7e8Gil3q2KqelpW5EL6+fV9sAEFfwiBFntLIxxGlu512fje5"

# Configure your database
config :stormtrader, Stormtrader.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "stormtrader_prod",
  pool_size: 15
