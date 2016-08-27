require_relative '../POROS/graph_builder'
class ApplicationController < ActionController::API
  include Knock::Authenticable
  GRAPH_DATA = GraphBuilder.new(Stop.all,Route.all)
end
