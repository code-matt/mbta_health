class CreateNodes < ActiveRecord::Migration[5.0]
  def change
    create_table :nodes do |t|
      t.string :x
      t.string :y
      t.string :stop_name
      t.string :node_id
      t.text :stop_ids
    end
  end
end
