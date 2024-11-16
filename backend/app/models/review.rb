# app/models/review.rb
class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :text, presence: true, length: { minimum: 15, tokenizer: ->(str) { str.scan(/\w+/) }, too_short: "must have at least 15 words" }

  after_create_commit :broadcast_to_friends_feed
  after_save :update_beer_rating

  private
  def update_beer_rating
    beer.update_avg_rating
  end

  def broadcast_to_friends_feed
    beer_data = {
      name: beer.name,
      avg_rating: beer.avg_rating,
      bar_name: beer.bars.first&.name || 'Sin bar asociado',
      country: beer.bars.first&.address&.country&.name || 'Desconocido',
      address: beer.bars.first&.address&.line1 || 'Sin dirección'
    }

    message = {
      id: id,
      type: 'beer_review',
      beer_id: beer.id, # Incluye beer_id explícitamente
      user_handle: user.handle,
      beer: beer_data,
      rating: rating,
      description: text,
      published_at: created_at
    }

    user.friends.each do |friend|
      ActionCable.server.broadcast("feed_channel_user_#{friend.id}", message)
    end
  end

  
end
