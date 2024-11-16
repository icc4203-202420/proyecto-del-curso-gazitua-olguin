# app/controllers/api/v1/feed_posts_controller.rb
class API::V1::FeedPostsController < ApplicationController
  before_action :authenticate_user!
    def index
      friend_ids = current_user.friends.pluck(:id)
      @feed_posts = FeedPost.where(user_id: friend_ids).order(created_at: :desc).limit(50)
      render json: @feed_posts.as_json(
        only: [:id, :description, :event_id, :event_name, :bar_name, :country],
        methods: [:image_url, :published_at, :user_handle]
      )
    end
  end
  