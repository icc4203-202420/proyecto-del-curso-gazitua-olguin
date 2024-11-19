class API::V1::UsersController < ApplicationController
  include Authenticable
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:friendships, :create_friendship]
  
  def index
    @users = User.all
    render json: @users.as_json(only: [:id, :handle, :first_name, :last_name])
  end

  def show
  
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: UserSerializer.new(@user).serializable_hash[:data][:attributes], status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end


  def search
    query = params[:query].downcase
    @users = User.where("LOWER(handle) LIKE ?", "%#{query}%")
    render json: { users: @users }, status: :ok
  end

  def current
    render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes], status: :ok
  end
  
  def friendships
    # Método para listar amistades o crear una nueva amistad
    if request.get?
      @friends = @user.friends
      render json: @friends, status: :ok
    elsif request.post?
      create_friendship
    end
  end

  def create_friendship
    # Verificar si el usuario autenticado es el que intenta agregar un amigo
    if current_user.id != @user.id
      render json: { error: 'Usuario no autorizado' }, status: :unauthorized
      return
    end
  
    @friend = User.find(params[:friend_id])
    @bar = Bar.find_by(id: params[:bar_id])
    @event = Event.find_by(id: params[:event_id]) if params[:event_id].present?
  
    # Crear la amistad usando current_user directamente
    @friendship = current_user.friendships.build(friend: @friend, bar: @bar, event: @event)
  
    if @friendship.save
      puts "Amistad creada con éxito entre el usuario #{current_user.id} y el amigo #{@friend.id} en el bar #{@bar.id}"
      render json: @friendship, status: :created
  
      # Enviar notificación push al usuario seguido
      if @friend.push_token.present?
        PushNotificationService.send_notification(
          to: @friend.push_token,
          title: 'Nuevo seguidor en BeerApp!',
          body: "#{current_user.handle} te ha seguido.",
          data: { screen: 'Inicio' }
        )
      end
    else
      puts "Error al crear amistad: #{@friendship.errors.full_messages}"
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

def update_push_token
    # Actualiza el token de notificación únicamente para el usuario actual
    if current_user
      # Elimina el token duplicado en cualquier otro usuario que lo tenga
      User.where(push_token: params[:push_token]).where.not(id: current_user.id).update_all(push_token: nil)
  
      # Actualiza el token para el usuario actual
      if current_user.update(push_token: params[:push_token])
        render json: { message: 'Push token updated successfully' }, status: :ok
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Usuario no autenticado' }, status: :unauthorized
    end
  end
  
  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id, :event_id)
  end
end