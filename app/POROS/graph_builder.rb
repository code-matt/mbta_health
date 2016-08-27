#wut
# RAILS_ENV = ARGV[0] || "deveolpment"
# require File.join(File.dirname(__FILE__), *%w[.. .. config environment])
# require 'singleton'

class GraphBuilder
  # include Singleton
  attr_reader :nodes, :edges

  def initialize(stops,routes)
    stops = stops.all
      .map{ |s| [s.stop_name, s.stop_lon, s.stop_lat] }
      .uniq
    @nodes = []
    @edges = []
    routes.each do |route|
      build_nodes(route)
    end
    build_edges(routes)
  end

  def build_nodes(route)
    trip = sort_trips(route.inbound.trips)
    parse_trip(trip)
  end

  def sort_trips(trips)
    trip = trips.sort{ |a,b| a.events.length <=> b.events.length }[-2].events
  end

  def parse_trip(trip)
    trip.each do |event|
      if @nodes.any?{ |node| node[:stop_name] == event.stop_name }
        next
      else
        @nodes << create_node(event)
      end
    end
  end

  def create_node(event)
    {
      x: 0,
      y: 0,
      stop_name: event["stop_name"],
      node_id: @nodes.length + 1
    }
  end

  ##***********EDGES

  def build_edges(routes)
    routes.each do |route|
      trip = sort_trips(route.inbound.trips)
      trip.each_with_index do |event,i|
        next if i == trip.length - 1
        new_edge = create_edge(
          @nodes.select{ |n| n[:stop_name] == event["stop_name"] }.first,
          @nodes.select{ |n| n[:stop_name] == trip[i+1]["stop_name"] }.first)
        if @edges.any?{ |edge| edge == new_edge }
          next
        else
          @edges << new_edge
        end
      end
    end
  end

  def create_edge(from,to)
    {
      from: from[:node_id],
      to: to[:node_id]
    }
  end
end

# builder = GraphBuilder.new(Stop.all,Route.all)
