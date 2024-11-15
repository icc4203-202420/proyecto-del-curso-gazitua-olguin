class AddAddressToFeedPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :feed_posts, :address, :string
  end
end
