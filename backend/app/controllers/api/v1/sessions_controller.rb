class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      # Enviar notificación de bienvenida usando el servicio
      send_welcome_notification(current_user)

      render json: {
        status: {
          code: 200, message: 'Logged in successfully.',
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes], token: request.env['warden-jwt_auth.token'] }
        }
      }, status: :ok
    else
      render json: {
        status: { message: "Invalid email or password." }
      }, status: :unauthorized
    end
  end

  def send_welcome_notification(user)
    return unless user.push_token.present?

    PushNotificationService.send_notification(
      to: user.push_token,
      title: '¡Bienvenido a BeerApp!',
      body: 'Gracias por unirte a BeerApp. ¡Disfruta de tus eventos cerveceros!',
      data: { screen: 'Inicio' }
    )
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(
        request.headers['Authorization'].split(' ').last,
        Rails.application.credentials.devise_jwt_secret_key,
        true,
        { algorithm: 'HS256' }
      ).first
      current_user = User.find(jwt_payload['sub'])
    end

    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
