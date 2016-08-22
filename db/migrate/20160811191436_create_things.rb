class CreateThings < ActiveRecord::Migration[5.0]
  def change
    create_table :things do |t|
      t.string :name, null: false
      t.integer :value, null: false
    end
  end
end
