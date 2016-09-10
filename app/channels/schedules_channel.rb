class SchedulesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'schedules'
    schedule_object = ApplicationController::SCHEDULE
    first_send(schedule_object)
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end

  def first_send(schedule_object)
    if(schedule_object.schedule == {})
      first_send(schedule_object)
      sleep 2
    else
      ActionCable.server.broadcast('schedules', encode(schedule_object.build_sch(schedule_object.schedule)))
    end
  end
end