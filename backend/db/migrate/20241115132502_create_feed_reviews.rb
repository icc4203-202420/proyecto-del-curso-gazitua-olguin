class CreateFeedReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :feed_reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :beer, null: false, foreign_key: true
      t.string :description
      t.string :bar_name
      t.string :country

      t.timestamps
    end
  end
end