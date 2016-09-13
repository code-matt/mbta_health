class SchedulesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'schedules'
    schedule_object = ApplicationController::SCHEDULE
    ActionCable.server.broadcast('schedules', encode(schedule_object.build_sch))
    ActionCable.server.broadcast('status', "1")
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end
end