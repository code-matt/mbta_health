require 'json'
require 'net/http'

# class SubwayScheduleJob
#   include SuckerPunch::Job

#   def perform(schedule_object)
#     print "Updating subway schedules in seperate thread..."

#     key = ENV['MBTA_KEY']
#     uri = URI('http://realtime.mbta.com/developer/api/v2/schedulebyroutes')
#     routes = 'Orange,Red,Greeb-B,Green-C,Green-D,Green-E,Mattapan'
#     max_time = 1440
#     max_trips = 30
#     params = {
#       api_key: key,
#       routes: routes,
#       max_time: max_time,
#       max_trips: max_trips }
#     uri.query = URI.encode_www_form(params)
#     res = Net::HTTP.get_response(uri)
#     data = JSON.parse(res.body)

#     schedule_object.subway_schedule = data
#     ActionCable.server.broadcast('schedules', remove_non_ascii(schedule_object.merge_schedules.to_json))
#     SubwayScheduleJob.perform_in(30, schedule_object)
#   end

#   def remove_non_ascii(replacement) 
#     replacement.encode('UTF-8', :invalid => :replace, :undef => :replace)
#   end

# end

class CRScheduleJob
  include SuckerPunch::Job

  def perform(schedule_object)
    print "Updating commuter rail schedules in seperate thread..."

    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/predictionsbyroutes')
    routes = 'CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,CR-Newburyport,CR-Providence,Orange,Red,Green-B,Green-C,Green-D,Green-E,Mattapan'
    params = {
      api_key: key,
      routes: routes}
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)

    schedule_object.schedule = data
    ActionCable.server.broadcast('schedules', remove_non_ascii(build_sch(schedule_object.schedule)))
    CRScheduleJob.perform_in(120, schedule_object)
  end

  def remove_non_ascii(replacement) 
    replacement.encode('UTF-8', :invalid => :replace, :undef => :replace)
  end

  def build_sch(schedules)
    schedule_data = {}
    schedules["mode"].each do |mode|
      mode["route"].each do |route|
        # stops_arr = Route.find_by(mbta_route_id: route["route_id"]).stops.all.map{ |s| s.mbta_stop_id}
        # found_arr = stops_arr.map{ |s| [0,0] }
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
                  pre_away: stop["pre_away"]
                }
            end
          end
        end
      end
    end
    schedule_data.to_json
  end
end
# stop_sequence: "100",
# stop_id: "70157",
# stop_name: "Arlington - Outbound",
# pre_dt: "1473196653",
# pre_away: "164"

class ScheduleBuilder
  attr_accessor :schedule

  def initialize()
    @schedule = {}

    CRScheduleJob.perform_async(self)
    # SubwayScheduleJob.perform_async(self)
  end

  # def merge_schedules
  #   {
  #     cr: @cr_schedule,
  #     subway: @subway_schedule
  #   }
  # end
end
