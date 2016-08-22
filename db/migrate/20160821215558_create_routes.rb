class CreateRoutes < ActiveRecord::Migration[5.0]
  def change
    create_table :routes do |t|
      t.string :mbta_route_id, null: false
      t.string :route_name, null: false
      t.belongs_to :mode

      t.timestamps
    end
  end
end
