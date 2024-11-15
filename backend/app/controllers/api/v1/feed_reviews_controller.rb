# app/controllers/api/v1/feed_reviews_controller.rb
class API::V1::FeedReviewsController < ApplicationController
  def index
    @feed_reviews = FeedReview.order(created_at: :desc).limit(50)
    render json: @feed_reviews.as_json(
      only: [:id, :description, :bar_name, :country],
      methods: [:published_at, :user_handle, :beer_details]
    )
  end
end
