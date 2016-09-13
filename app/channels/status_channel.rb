class StatusChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'status'
  end
end