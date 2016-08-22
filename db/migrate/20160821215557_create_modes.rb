class CreateModes < ActiveRecord::Migration[5.0]
  def change
    create_table :modes do |t|
      t.string :mode_name, null: false
      t.string :mbta_mode_id, null: false
      t.timestamps
    end
  end
end
