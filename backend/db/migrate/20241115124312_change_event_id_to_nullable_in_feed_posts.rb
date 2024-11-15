class ChangeEventIdToNullableInFeedPosts < ActiveRecord::Migration[7.1]
  def change
    change_column_null :feed_posts, :event_id, true
  end
end
