class AddMbtaIdToNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :mbta_id, :string
  end
end
