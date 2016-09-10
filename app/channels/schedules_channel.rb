class SchedulesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'schedules'
    schedule_object = ApplicationController::SCHEDULE
    ActionCable.server.broadcast('schedules', encode(build_sch(schedule_object.schedule)))
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end

  def build_sch(schedules)
    schedule_data = {}
    schedules["mode"].each do |mode|
      mode["route"].each do |route|
        schedule_data[route["route_id"]] = {}
        route["direction"].each do |direction|
          schedule_data[route["route_id"]][direction["direction_name"]] = []
          direction["trip"].each do |trip|
            trip["stop"].each do |stop|
              schedule_data[route["route_id"]][direction["direction_name"]] <<
                {
                  stop_sequence: stop["stop_sequence"],
                  stop_id: stop["stop_id"],
                  stop_name: stop["stop_name"],
                  pre_dt: stop["pre_dt"],
                  pre_away: stop["pre_away"],
                  trip_headsign: trip["trip_headsign"],
                  trip_name: trip["trip_name"]
                }
            end
          end
        end
      end
    end
    schedule_data.to_json
  end
end