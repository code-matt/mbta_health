require_relative '../POROS/graph_builder'
require_relative '../POROS/alerts_builder'
require_relative '../POROS/schedule_builder'
require_relative '../POROS/status_tracker'
class ApplicationController < ActionController::API
  STATUS = StatusTracker.new
  SCHEDULE = ScheduleBuilder.new
  ALERTS = AlertsBuilder.new
  GRAPH_DATA = GraphBuilder.new
end

