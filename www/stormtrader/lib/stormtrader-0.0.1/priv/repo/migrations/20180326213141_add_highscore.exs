defmodule Stormtrader.Repo.Migrations.AddHighscore do
  use Ecto.Migration

  def change do

    alter table(:users) do
      add :highscore, :integer, default: 0
      
    end
  end
end
