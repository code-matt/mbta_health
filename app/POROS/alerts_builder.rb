require 'json'
require 'net/http'

class AlertsJob
  include SuckerPunch::Job

  def perform(stops,ab_object)
    puts "Updating alerts in seperate thread..."
    stops.each do |stop|
      key = ENV['MBTA_KEY']
      uri = URI('http://realtime.mbta.com/developer/api/v2/alertsbystop')
      params = { 
        api_key: key,
        stop: stop["mbta_stop_id"],
        include_access_alerts: true,
        include_service_alerts: true}

      uri.query = URI.encode_www_form(params)
      res = Net::HTTP.get_response(uri)
      data = JSON.parse(res.body)

      ab_object.alerts["#{stop['mbta_stop_id']}"] = data
    end

    AlertsJob.perform_in(300, stops, ab_object)
  end
end

class AlertsBuilder
  attr_accessor :stops, :alerts

  def initialize()
    @stops = Stop.all
    @alerts = {}

    AlertsJob.perform_async(@stops, self)
  end
end