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
    params = { 
      api_key: key,
      format: 'json'}
    uri.query = URI.encode_www_form(params)
    http = Net::HTTP.new(uri.host)
    http.read_timeout = 5
    http.open_timeout = 5
    begin
      res = http.get(uri.to_s)
    rescue SocketError, Net::OpenTimeout, Net::ReadTimeout
      puts "Error with MBTA!!!"
      AlertsJob.perform_in(30, stops, ab_object)
      return
    end
    if (res.is_a?(Net::HTTPSuccess) && res.body)
      if(valid_json?(res.body))
        data = JSON.parse(res.body.force_encoding('UTF-8'))

        data["alerts"].each do |alert|
          alert["affected_services"].each do |service|
            service.second.each do |stop|
              if arr.include?(stop['stop_id'])
                alerts << {
                  id: stop["stop_id"],
                  alert: {
                    id: alert["id"],
                    header_text: alert["header_text"],
                    severity: alert["severity"],
                    alert: alert["effect_name"]
                  }
                }
              end
            end
          end
        end
      ab_object.alerts["alerts"] = alerts
      ActionCable.server.broadcast('alerts', encode(ab_object.alerts.to_json))
      AlertsJob.perform_in(30, stops, ab_object)
      else
        AlertsJob.perform_in(30, stops, ab_object)
      end
    else
      AlertsJob.perform_in(30, stops, ab_object)
    end
  end

  def valid_json?(json)
    begin
      JSON.parse(json)
      return true
    rescue JSON::ParserError => e
      return false
    end
  end
  
  def encode(str) 
    str = str.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
    str = str.force_encoding(Encoding::UTF_8)
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