#keeping this here for now for testing
# RAILS_ENV = ARGV[0] || "deveolpment"
# require File.join(File.dirname(__FILE__), *%w[.. .. config environment])

require 'route_colors'
class GraphBuilder
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

  #this is to get around what I am pretty sure is a bug in the MBTA API
  #some routes double list their stops for either one or two of their trips
  def sort_trips(trips)
    trips.sort{ |a,b| a.events.length <=> b.events.length }[-3].events
  end

  def parse_trip(trip)
    trip.each do |event|
      if @nodes.any?{ |node| node[:stop_name] == parse_stop_name(event.stop_name) }
        next
      else
        @nodes << create_node(event)
      end
    end
  end

  def create_node(event)
    stop = Stop.where(stop_name: event["stop_name"]).first
    coords = get_xy([
      stop["stop_lat"].to_f,
      stop["stop_lon"].to_f])
    {
      x: coords[0],
      y: coords[1],
      stop_name: parse_stop_name(event["stop_name"]),
      node_id: @nodes.length + 1,
      mbta_id: event["mbta_stop_id"]
    }
  end

  def parse_stop_name(name)
    name.split('-').first.delete(" ")
  end

  def get_xy(coords)
    coords = reflect_xy_and_rotate(coords)
    north_station_origin = [42.365551,-71.061251]

    [((north_station_origin[0] - coords[0]) * 50000).ceil,
      ((coords[1] - north_station_origin[1]) * 50000).ceil]
  end

  def reflect_xy_and_rotate(coords)
    coords[1] *= -1
    coords[0] *= -1
    coords[0], coords[1] = coords[1], coords[0]
    coords
  end
  ##***********EDGES

  def build_edges(routes)
    routes.each do |route|
      trip = sort_trips(route.inbound.trips)
      trip.each_with_index do |event,i|
        next if i == trip.length - 1
        new_edge = create_edge(
          @nodes.select{ |n| n[:stop_name] == parse_stop_name(event["stop_name"]) }.first,
          @nodes.select{ |n| n[:stop_name] == parse_stop_name(trip[i+1]["stop_name"]) }.first,
          route.route_name,
          ROUTE_COLORS.select{ |r| r[:name] == route.route_name}.first[:color])

        if @edges.any?{ |edge| edge == new_edge }
          next
        else
          @edges << new_edge
        end
      end
    end
  end

  def create_edge(from,to,route,color)
    {
      from: from[:node_id],
      to: to[:node_id],
      route: route,
      color: color
    }
  end
end

#keeping this here for now for testing
# builder = GraphBuilder.new(Stop.all,Route.all)
