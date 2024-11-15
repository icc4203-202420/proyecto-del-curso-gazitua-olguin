# app/models/feed_review.rb
class FeedReview < ApplicationRecord
    belongs_to :user
    belongs_to :beer
  
    # Método para formatear la fecha de publicación
    def published_at
      created_at.strftime('%Y-%m-%d %H:%M:%S')
    end
  
    # Método para obtener el handle del usuario
    def user_handle
      user.handle
    end
  
    # Método para obtener los detalles de la cerveza
    def beer_details
      {
        name: beer.name,
        avg_rating: beer.avg_rating,
        bar_name: beer.bars.first&.name || 'Sin bar asociado',
        country: beer.bars.first&.address&.country&.name || 'Desconocido',
        address: beer.bars.first&.address&.line1 || 'Sin dirección'
      }
    end
  end
  