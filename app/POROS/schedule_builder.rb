require 'json'
require 'net/http'
require 'route_colors'

class CRScheduleJob
  include SuckerPunch::Job

  def perform(schedule_object)
    print "Updating commuter rail schedules in seperate thread..."
    mbta_status = ApplicationController::STATUS

    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/predictionsbyroutes')
    routes = 'CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,CR-Newburyport,CR-Providence,Blue,Orange,Red,Green-B,Green-C,Green-D,Green-E,Mattapan'
    params = {
      format: 'json',
      api_key: key,
      routes: routes}
    uri.query = URI.encode_www_form(params)
    http = Net::HTTP.new(uri.host)
    http.read_timeout = 5
    http.open_timeout = 5
    begin
      res = http.get(uri.to_s)
    rescue SocketError, Net::OpenTimeout, Net::ReadTimeout
      puts "Error with MBTA!!!"
      ActionCable.server.broadcast('status', "0")
      CRScheduleJob.perform_in(30, schedule_object)
      return
    end
    if (res.is_a?(Net::HTTPSuccess) && res.body)
      if(valid_json?(res.body))
        data = JSON.parse(res.body.force_encoding('UTF-8'))

        schedule_object.schedule = data
        ActionCable.server.broadcast('schedules', encode(schedule_object.build_sch))
        mbta_status.status = 1
        mbta_status.broadcast
        CRScheduleJob.perform_in(30, schedule_object)
      else
        mbta_status.status = 0
        mbta_status.broadcast
        CRScheduleJob.perform_in(30, schedule_object)
      end
    else
      mbta_status.status = 0
      mbta_status.broadcast
      CRScheduleJob.perform_in(30, schedule_object)
    end
  end

  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
  end

  def valid_json?(json)
    begin
      JSON.parse(json)
      return true
    rescue JSON::JSONError
      return false
    end
  end
end

class ScheduleBuilder
  attr_accessor :schedule

  def initialize()
    @schedule = {}

    CRScheduleJob.perform_async(self)
  end

  def build_sch()
    schedule_data = {}
    @schedule["mode"].each do |mode|
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
                  trip_name: trip["trip_name"],
                  mode: mode["mode_name"] == "Subway" ? "subway":"train",
                  color: ROUTE_COLORS.select{ |r| r[:name] == route["route_name"] }.first[:color]
                }
            end
          end
        end
      end
    end
    schedule_data.to_json
  end
end
