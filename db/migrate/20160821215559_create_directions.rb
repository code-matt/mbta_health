class CreateDirections < ActiveRecord::Migration[5.0]
  def change
    create_table :directions do |t|
      t.string :mbta_direction_id, null: false
      t.string :direction_name, null: false
      t.belongs_to :route

      t.timestamps
    end
  end
end
