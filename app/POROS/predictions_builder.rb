require 'json'
require 'net/http'

class PredictionJob
  include SuckerPunch::Job

  def perform(pre_object)
    print "Updating route predictions in seperate thread..."

    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/predictionsbyroutes')
    routes = 'Orange,Red,Greeb-B,Green-C,Green-D,Green-E,Mattapan,
    CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,
    CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,
    CR-Newburyport,CR-Providence'
    params = { api_key: key, routes: routes}
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)

    pre_object.data = data
    ActionCable.server.broadcast('predictions', remove_non_ascii(pre_object.data.to_json))
    PredictionJob.perform_in(30, pre_object)
  end

  def remove_non_ascii(replacement) 
    replacement.encode('UTF-8', :invalid => :replace, :undef => :replace)
  end
end

class PredictionsBuilder
  attr_accessor :data

  def initialize()
    @data = {}

    PredictionJob.perform_in(300,self)
  end
end