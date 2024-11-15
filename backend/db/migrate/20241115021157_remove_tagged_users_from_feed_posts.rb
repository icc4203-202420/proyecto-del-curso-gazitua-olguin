class RemoveTaggedUsersFromFeedPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :feed_posts, :tagged_users, :jsonb
  end
end
