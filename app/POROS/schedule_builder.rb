require 'json'
require 'net/http'

class CRScheduleJob
  include SuckerPunch::Job

  def perform(schedule_object)
    print "Updating commuter rail schedules in seperate thread..."

    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/predictionsbyroutes')
    routes = 'CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,CR-Newburyport,CR-Providence,Blue,Orange,Red,Green-B,Green-C,Green-D,Green-E,Mattapan'
    params = {
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
      CRScheduleJob.perform_in(30, schedule_object)
      return
    end
    if (res.is_a?(Net::HTTPSuccess) && res.body)
      if(valid_json?(res.body))
        data = JSON.parse(res.body.force_encoding('UTF-8'))

        schedule_object.schedule = data
        ActionCable.server.broadcast('schedules', remove_non_ascii(build_sch(schedule_object.schedule)))
        CRScheduleJob.perform_in(30, schedule_object)
      else
        CRScheduleJob.perform_in(30, schedule_object)
      end
    else
      CRScheduleJob.perform_in(30, schedule_object)
    end
  end

  def remove_non_ascii(replacement) 
    replacement.encode('UTF-8', :invalid => :replace, :undef => :replace)
  end

  def valid_json?(json)
    begin
      JSON.parse(json)
      return true
    rescue JSON::ParserError => e
      return false
    end
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

class ScheduleBuilder
  attr_accessor :schedule

  def initialize()
    @schedule = {}

    CRScheduleJob.perform_async(self)
  end
end
