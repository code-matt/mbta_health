class CreateEdges < ActiveRecord::Migration[5.0]
  def change
    create_table :edges do |t|
      t.string :from
      t.string :to
      t.string :route
      t.string :color
      t.string :routeId
    end
  end
end
