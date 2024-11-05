# app/services/push_notification_service.rb
require 'net/http'
require 'uri'
require 'json'

class PushNotificationService
  def self.send_notification(to:, title:, body:, data: {})
    if to
      # Enviar notificación inmediata si hay un push_token
      message = {
        to: to,
        sound: 'default',
        title: title,
        body: body,
        data: data
      }

      url = URI.parse('https://exp.host/--/api/v2/push/send')
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(url.path, { 'Content-Type' => 'application/json' })
      request.body = message.to_json

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        Rails.logger.info("Notificación enviada con éxito a #{to}")
        return true
      else
        Rails.logger.error("Error enviando notificación: #{response.body}")
        return false
      end
    else
      # Guardar notificación como pendiente si no hay push_token
      user_id = data[:user_id] # Suponiendo que data tiene el ID del usuario al que va dirigida
      if user_id
        PendingNotification.create(user_id: user_id, title: title, body: body, data: data)
        Rails.logger.info("Notificación almacenada como pendiente para el usuario #{user_id}")
      end
    end
  end
end