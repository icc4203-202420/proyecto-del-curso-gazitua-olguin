# app/channels/feed_channel.rb
class FeedChannel < ApplicationCable::Channel
  def subscribed
    # Autenticación del usuario en el canal
    reject unless current_user

    Rails.logger.info "Usuario conectado al canal: #{current_user.id}"
    # Identificar al canal del usuario autenticado
    stream_from "feed_channel_user_#{current_user.id}"
  end

  def unsubscribed
    # Aquí puedes realizar tareas de limpieza al desconectarse
  end
end
