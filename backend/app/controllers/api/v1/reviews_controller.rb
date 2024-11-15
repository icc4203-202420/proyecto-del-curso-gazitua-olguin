class API::V1::ReviewsController < ApplicationController
  include Authenticable
  respond_to :json
  before_action :authenticate_user! 
  before_action :set_user, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = Review.where(user: @user)
    render json: { reviews: @reviews }, status: :ok
  end
  
  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = current_user.reviews.build(review_params)


    if @review.save

      feed_review = FeedReview.create!(
        user: current_user,
        beer: @review.beer,
        description: "Evaluó la cerveza #{@review.beer.name} con #{@review.rating}/5.",
        bar_name: @review.beer.bars.first&.name || "Sin bar asociado",
        country: @review.beer.bars.first&.address&.country&.name || "Desconocido",
        address: @review.beer.bars.first&.address&.line1 || "Sin dirección"
      )
      
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    user_id = params[:review][:user_id]  # Extraer el user_id de params[:review]
    Rails.logger.info "User ID received: #{user_id}"
    begin
      @user = User.find(user_id)
    rescue ActiveRecord::RecordNotFound
      Rails.logger.info "User with ID #{user_id} not found"
      render json: { error: 'User not found' }, status: :not_found
    end
  end
  
  
  

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
