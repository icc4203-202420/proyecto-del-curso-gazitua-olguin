class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable
  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy, :check_in, :attendees, :pictures]
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :check_in]

  def index
    if params[:bar_id]
      @bar = Bar.find(params[:bar_id])
      @events = @bar.events
    else
      @events = Event.all
    end
    render json: { events: @events }, status: :ok
  end

  def show
    if @event.flyer.attached?
      render json: @event.as_json.merge({ 
        flyer_url: url_for(@event.flyer), 
        thumbnail_url: url_for(@event.thumbnail) }), 
        status: :ok
    else
      render json: { event: @event.as_json(include: :bar) }, status: :ok
    end
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end  

  def check_in
    attendance = Attendance.find_or_initialize_by(user: current_user, event: @event)
    
    if attendance.checked_in
      render json: { message: "Ya confirmaste tu asistencia a este evento." }, status: :ok
    else
      attendance.check_in
      render json: { message: "Has confirmado tu asistencia." }, status: :ok

      # Notificar a todos los amigos del usuario sobre el check-in
      notify_friends_about_check_in(current_user, @event)
    end
  end

  # Listar los usuarios que han hecho check-in
  def attendees
    attendees = @event.users.includes(:friends)
    friends = current_user.friends

    render json: {
      friends: attendees & friends, # Mostrar primero los amigos que asistieron
      others: attendees - friends # El resto de asistentes que no son amigos
    }, status: :ok
  end

  # Obtener todas las fotos asociadas con un evento
  def pictures
    if @event.event_pictures.any?
      pictures_data = @event.event_pictures.map do |event_picture|
        if event_picture.image.attached?
          {
            id: event_picture.id,
            image_url: url_for(event_picture.image),
            description: event_picture.description,
            tagged_users: event_picture.tagged_users.map(&:handle) 
          }
        end
      end.compact

      render json: pictures_data
    else
      render json: { message: "No pictures found for this event." }, status: :not_found
    end
  end

  private
  def notify_friends_about_check_in(user, event)
    user.friends.each do |friend|
      next unless friend.push_token.present?

      PushNotificationService.send_notification(
        to: friend.push_token,
        title: "#{user.handle} asistirá a un evento",
        body: "#{user.handle} ha confirmado asistencia al evento #{event.name}.",
        data: { screen: 'Inicio' } # Cambia a la pantalla que desees mostrar al abrir la app
      )
    end
  end

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image[:io], 
      filename: decoded_image[:filename], 
      content_type: decoded_image[:content_type])
  end 

  def event_params
    params.require(:event).permit(:name, :description, :date, :bar_id, :flyer)
  end

  def event_picture_params
    params.require(:event_picture).permit(:image, :description)
  end
end