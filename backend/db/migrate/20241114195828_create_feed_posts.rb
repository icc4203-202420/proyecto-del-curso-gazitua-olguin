class CreateFeedPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :feed_posts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true
      t.string :image_url
      t.text :description
      t.jsonb :tagged_users, default: [] # Cambiado a JSONB
      t.string :event_name
      t.string :bar_name
      t.string :country

      t.timestamps
    end
  end
end
