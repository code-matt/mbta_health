require_relative '../POROS/graph_builder'
require_relative '../POROS/alerts_builder'
require_relative '../POROS/schedule_builder'
# require_relative '../POROS/predictions_builder'
class ApplicationController < ActionController::API
  include Knock::Authenticable
  GRAPH_DATA = GraphBuilder.new(Stop.all,Route.all)
  SCHEDULE = ScheduleBuilder.new
  ALERTS = AlertsBuilder.new
  PREDICTIONS = PredictionsBuilder.new
end

