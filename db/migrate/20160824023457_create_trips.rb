class CreateTrips < ActiveRecord::Migration[5.0]
  def change
    create_table :trips do |t|
      t.string :trip_name, null: false
      t.string :mbta_trip_id, null: false

      t.belongs_to :direction, index: true, null: false
    end
  end
end
