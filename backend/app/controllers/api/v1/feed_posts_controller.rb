class API::V1::FeedPostsController < ApplicationController
  def index
    # Obtener las amistades del usuario actual
    friend_ids = current_user.friends.pluck(:id)

    # Filtrar las publicaciones basadas en las amistades
    @feed_posts = FeedPost.where(user_id: friend_ids).order(created_at: :desc).limit(50)

    render json: @feed_posts.as_json(
      only: [:id, :description, :tagged_users, :event_name, :bar_name, :country],
      methods: [:image_url, :published_at, :user_handle]
    )
  end
end
