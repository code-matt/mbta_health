class SchedulesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'schedules'
  end
end