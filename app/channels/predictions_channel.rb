class PredictionsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'predictions'
  end
end