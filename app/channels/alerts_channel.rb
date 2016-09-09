class AlertsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'alerts'
    ab_object = ApplicationController::ALERTS
    ActionCable.server.broadcast('alerts', remove_non_ascii(ab_object.alerts.to_json))
  end

  def remove_non_ascii(replacement) 
    replacement.encode('UTF-8', :invalid => :replace, :undef => :replace)
  end
end
