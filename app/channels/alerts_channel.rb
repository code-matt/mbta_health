class AlertsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'alerts'
    ab_object = ApplicationController::ALERTS
    first_send(ab_object)
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end

  def first_send(ab_object)
    if(ab_object.alerts == {})
      first_send(ab_object)
      sleep 2
    else
      ActionCable.server.broadcast('alerts', encode(ab_object.alerts.to_json))
    end
  end
end
