class CreateStops < ActiveRecord::Migration[5.0]
  def change
    create_table :stops do |t|
      t.string :stop_order, null: false
      t.string :mbta_stop_id, null: false
      t.string :stop_name, null: false
      t.string :parent_station, null: false
      t.string :parent_station_name, null: false
      t.string :stop_lat, null: false
      t.string :stop_lon, null: false
      t.string :direction, null: false
      t.belongs_to :route


      t.timestamps
    end
  end
end
