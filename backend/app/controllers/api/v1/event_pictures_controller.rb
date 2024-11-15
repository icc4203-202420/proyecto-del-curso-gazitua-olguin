class API::V1::EventPicturesController < ApplicationController
  include Authenticable
  before_action :set_event_picture, only: [:tag_user, :tagged_users]
  before_action :set_active_storage_url_options

# app/controllers/api/v1/event_pictures_controller.rb
def create
  @event_picture = EventPicture.new(event_picture_params)
  @event_picture.user = current_user

  if @event_picture.save
    tagged_users = []
    # Procesa las etiquetas si `tag_handles` está presente y tiene valores válidos
    if params[:tag_handles].present? && params[:tag_handles].values.any?(&:present?)
      params[:tag_handles].each do |_, handle|
        user = User.find_by(handle: handle.strip)
        if user
          Tagging.create(user: user, event_picture: @event_picture)
          send_notification_to_tagged_user(user, @event_picture)
          tagged_users << user # Añade el usuario etiquetado
        end
      end
    end

    # Crear la publicación en el feed con usuarios etiquetados
    feed_post = FeedPost.create!(
      user: current_user,
      event: @event_picture.event,
      description: @event_picture.description,
      event_name: @event_picture.event.name,
      bar_name: @event_picture.event.bar&.name,
      country: @event_picture.event.bar&.address&.country&.name
    )

     # Adjuntar la imagen al `FeedPost` usando la URL de la imagen del `EventPicture`
     feed_post.image.attach(@event_picture.image.blob) # Asociar el mismo blob

    # Asigna usuarios etiquetados al `FeedPost`
    feed_post.tagged_users << tagged_users

    render json: { success: true, message: "Event picture and feed post created successfully" }, status: :created
  else
    render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
  end
end

  


  def tag_user
    event_picture = EventPicture.find_by(id: params[:id], event_id: params[:event_id])
    user = User.find_by(handle: params[:handle]) # Etiquetar usando el handle del usuario

    if event_picture && user
      tagging = Tagging.create(user: user, event_picture: event_picture)

      if tagging.persisted?
        render json: { message: 'User tagged successfully' }, status: :ok
      else
        render json: { error: 'Failed to tag user' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Invalid event picture or user' }, status: :not_found
    end
  end

  def tagged_users
    tagged_users = @event_picture.taggings.includes(:user).map(&:user)

    render json: tagged_users, status: :ok
  end

  private

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = { host: 'http://localhost:3001' }
  end

  def send_notification_to_tagged_user(user, event_picture)
    return unless user.push_token.present?

    PushNotificationService.send_notification(
      to: user.push_token,
      title: '¡Has sido etiquetado en una foto!',
      body: "#{current_user.handle} te ha etiquetado en una foto del evento.",
      data: { screen: 'Inicio' }
    )
  end

  def event_picture_params
    params.require(:event_picture).permit(:image, :description, :event_id, tag_handles: [])
  end
  

  def set_event_picture
    @event_picture = EventPicture.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Event picture not found." }, status: :not_found
  end
end
