module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      reject_unauthorized_connection unless current_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      decoded_token = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, { algorithm: 'HS256' })
      user_id = decoded_token[0]["sub"]
      User.find_by(id: user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end
  end
end
