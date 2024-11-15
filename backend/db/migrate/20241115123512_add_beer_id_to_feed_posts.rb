class AddBeerIdToFeedPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :feed_posts, :beer_id, :integer
  end
end
