class AlertsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'alerts'
    ab_object = ApplicationController::ALERTS
    ActionCable.server.broadcast('alerts', encode(ab_object.alerts.to_json))
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end
end
