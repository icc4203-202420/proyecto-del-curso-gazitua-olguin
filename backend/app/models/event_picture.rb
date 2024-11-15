# app/models/event_picture.rb
class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image
  has_many :taggings, dependent: :destroy
  has_many :tagged_users, through: :taggings, source: :user
  validates :image, presence: true
  validates :event, presence: true
  validates :user, presence: true
  after_create_commit :broadcast_to_friends_feed

  private

  def broadcast_to_friends_feed
    return unless image.attached?
    image_url = Rails.application.routes.url_helpers.url_for(image)

    user.friends.each do |friend|
      message = {
        id: id,
        image_url: image_url,
        description: description,
        tagged_users: tagged_users.pluck(:handle),
        event_name: event.name,
        bar_name: event.bar&.name,
        country: event.bar.address&.country&.name,
        published_at: created_at,
        event_id: event.id
      }

      ActionCable.server.broadcast("feed_channel_user_#{friend.id}", message)
    end
  end
end
