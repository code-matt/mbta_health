require_relative '../POROS/graph_builder'
require_relative '../POROS/alerts_builder'
require_relative '../POROS/schedule_builder'
class ApplicationController < ActionController::API
  GRAPH_DATA = GraphBuilder.new
  SCHEDULE = ScheduleBuilder.new
  ALERTS = AlertsBuilder.new
end

