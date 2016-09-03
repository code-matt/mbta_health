require 'json'
require 'net/http'

class AlertsJob
  include SuckerPunch::Job

  def perform(stops,ab_object)
    print "Updating alerts in seperate thread..."
    arr = stops.map{ |stop| stop.mbta_stop_id }.uniq
    alerts = []

    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/alerts')
    params = { api_key: key}
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)

    data["alerts"].each do |alert|
      alert["affected_services"].each do |service|
        service.second.each do |stop|
          if arr.include?(stop['stop_id'])
            alerts << {
              id: stop["stop_id"],
              alert: alert
            }
          end
        end
      end
    end

    ab_object.alerts["alerts"] = alerts
    ActionCable.server.broadcast('alerts', ab_object.alerts.to_json)
    AlertsJob.perform_in(30, stops, ab_object)
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