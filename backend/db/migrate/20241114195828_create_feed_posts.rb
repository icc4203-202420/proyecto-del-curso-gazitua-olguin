class CreateFeedPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :feed_posts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, foreign_key: true, null: true # Hacemos que event_id sea opcional
      t.integer :beer_id # Agregamos beer_id
      t.string :address # Agregamos address
      t.text :description
      t.string :event_name
      t.string :bar_name
      t.string :country

      t.timestamps
    end
  end
end
