# app/models/feed_post.rb
class FeedPost < ApplicationRecord
  belongs_to :user
  belongs_to :event

  has_many :feed_post_taggings, dependent: :destroy
  has_many :tagged_users, through: :feed_post_taggings, source: :user
  # Asegúrate de que `FeedPost` tenga un archivo adjunto llamado `image`
  has_one_attached :image

  validates :description, :event_name, :bar_name, :country, presence: true

  # Método para obtener la URL de la imagen
  def image_url
    Rails.application.routes.url_helpers.url_for(image) if image.attached?
  end

  # Método para formatear la fecha de publicación
  def published_at
    created_at.strftime('%Y-%m-%d %H:%M:%S') # Cambia el formato según prefieras
  end

  # Método para obtener el handle del usuario
  def user_handle
    user.handle
  end
end
