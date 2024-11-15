class CreateFeedPostTaggings < ActiveRecord::Migration[7.1]
  def change
    create_table :feed_post_taggings do |t|
      t.references :feed_post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
