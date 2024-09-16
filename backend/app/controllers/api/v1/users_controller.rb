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
    if @user.nil?
      render json: { error: 'User not found' }, status: :not_found
      return
    end
    @friends = @user.friends
    render json: @friends, status: :ok
  end

  def create_friendship
    @friend = User.find(params[:friend_id])
    @friendship = @user.friendships.build(friend: @friend)
    if @friendship.save
      render json: @friendship, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
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
    params.require(:friendship). permit(:friend_id)
  end
end