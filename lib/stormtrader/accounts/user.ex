defmodule Stormtrader.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :name, :string
    field :highscore, :integer
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :highscore])
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end
