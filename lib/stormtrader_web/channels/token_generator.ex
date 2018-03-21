defmodule StormtraderWeb.TokenGenerator do

  def new() do
    game_id = generate_token(8)
    {:ok, game_id}
  end

  def generate_token(n) do
    n
    |> :crypto.strong_rand_bytes
    |> Base.encode16(case: :lower)
  end
end
