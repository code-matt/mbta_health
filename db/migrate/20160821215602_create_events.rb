class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.string :sch_arr_dt, null: false
      t.string :sch_dep_dt, null: false
      t.string :mbta_trip_id, null: false
      t.string :trip_name, null: false

      t.belongs_to :stop, index: true, null: false

      t.timestamps
    end
  end
end
