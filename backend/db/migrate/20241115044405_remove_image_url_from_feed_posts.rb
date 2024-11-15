class RemoveImageUrlFromFeedPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :feed_posts, :image_url, :string
  end
end
