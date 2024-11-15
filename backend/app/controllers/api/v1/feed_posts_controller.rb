# app/controllers/api/v1/feed_posts_controller.rb
class API::V1::FeedPostsController < ApplicationController
    def index
      @feed_posts = FeedPost.order(created_at: :desc).limit(50)
      render json: @feed_posts.as_json(
        only: [:id, :description, :event_id, :event_name, :bar_name, :country],
        methods: [:image_url, :published_at, :user_handle]
      )
    end
  end
  