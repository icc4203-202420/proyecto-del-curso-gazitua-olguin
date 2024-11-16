# app/controllers/api/v1/feed_reviews_controller.rb
class API::V1::FeedReviewsController < ApplicationController
  before_action :authenticate_user!
  def index
    friend_ids = current_user.friends.pluck(:id)
    @feed_reviews = FeedReview.where(user_id: friend_ids).order(created_at: :desc).limit(50)
    render json: @feed_reviews.as_json(
      only: [:id, :description, :bar_name, :country, :beer_id], 
      methods: [:published_at, :user_handle, :beer_details]
    )
  end
end
