# app/models/feed_post_tagging.rb
class FeedPostTagging < ApplicationRecord
  belongs_to :feed_post
  belongs_to :user
end