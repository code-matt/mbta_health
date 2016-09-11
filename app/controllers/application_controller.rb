require_relative '../POROS/graph_builder'
require_relative '../POROS/alerts_builder'
require_relative '../POROS/schedule_builder'
class ApplicationController < ActionController::API
  SCHEDULE = ScheduleBuilder.new
  ALERTS = AlertsBuilder.new
  GRAPH_DATA = GraphBuilder.new
end

