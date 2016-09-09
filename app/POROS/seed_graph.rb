# rails runner "app/POROS/seed_graph.rb"
require 'route_colors'
require 'csv'

class GraphSeeder
  attr_reader :nodes, :edges

  def initialize(routes)
    @nodes = []
    @edges = []
    routes.each do |route|
      build_nodes(route)
    end
    build_edges
    write_db_records
  end

  def write_db_records
    Node.delete_all
    Edge.delete_all

    @nodes.each_with_index do |node,i|
      Node.create(
        x: node[:x],
        y: node[:y],
        stop_name: node[:stop_name],
        node_id: node[:node_id],
        stop_ids: node[:stop_ids].to_json,
        mbta_id: node[:mbta_id]
      )
      puts "created node #{i}"
    end

    @edges.each_with_index do |edge,i|
      Edge.create(
        from: edge[:from],
        to: edge[:to],
        route: edge[:route],
        color: edge[:color],
        routeId: edge[:route_id]
      )
      puts "created edge #{i}"
    end
  end

  def build_nodes(route)
    outbound = route.stops[0..(route.stops.length/2) - 1]
    inbound = route.stops[route.stops.length/2..-1]

    outbound.each do |stop|
      coords = get_xy([
        stop['stop_lat'].to_f,
        stop['stop_lon'].to_f])
      if (stop["parent_station_name"] != "")
        if @nodes.any?{ |node| node[:stop_name] == stop["parent_station_name"] }
          add_stop(stop,stop["parent_station_name"],route.mbta_route_id)
        else
          create_node(coords[0],coords[1],stop["parent_station_name"],stop["mbta_stop_id"])
          add_stop(stop,stop["parent_station_name"],route.mbta_route_id)
        end
      else
        if @nodes.any?{ |node| node[:stop_name] == stop["stop_name"] }
          next #add stop id?
        else
          create_node(coords[0],coords[1],stop["stop_name"],stop["mbta_stop_id"])
          add_stop(stop,stop["stop_name"],route.mbta_route_id)
        end
      end
    end

    inbound.each do |stop|
      coords = get_xy([
        stop['stop_lat'].to_f,
        stop['stop_lon'].to_f])
      if (stop["parent_station_name"] != "")
        if @nodes.any?{ |node| node[:stop_name] == stop["parent_station_name"] }
          add_stop(stop,stop["parent_station_name"],route.mbta_route_id)
        else
          create_node(coords[0],coords[1],stop["parent_station_name"],stop["mbta_stop_id"])
          add_stop(stop,stop["parent_station_name"],route.mbta_route_id)
        end
      else
        if @nodes.any?{ |node| node[:stop_name] == stop["stop_name"] }
          next #add stop_id?
        else
          create_node(coords[0],coords[1],stop["stop_name"],stop["mbta_stop_id"])
          add_stop(stop,stop["stop_name"],route.mbta_route_id)
        end
      end
    end
  end

  def create_node(x,y,stop_name,mbta_id)
    new = {
      x: x,
      y: y,
      stop_name: stop_name,
      node_id: @nodes.length + 1,
      stop_ids: [],
      mbta_id: mbta_id
    }
    @nodes << new
  end

  def add_stop(record,stop,route_id)
    found_node = @nodes.find{ |node| node[:stop_name] == stop }
    new = {
      id: record.mbta_stop_id,
      name: record.stop_name,
      route_id: route_id
    }
    found_node[:stop_ids] << new
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

  def create_edge(from,to,route,color,routeId)
    {
      from: from,
      to: to,
      route: route,
      color: color,
      routeId: routeId
    }
  end

  def build_edges
    key = ENV['MBTA_KEY']
    uri = URI('http://realtime.mbta.com/developer/api/v2/schedulebyroutes')
    routes = 'Orange,Blue,Red,Green-B,Green-C,Green-D,Green-E,Mattapan,CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,CR-Newburyport,CR-Providence'
    max_trips = 20
    max_time = 1440
    params = { api_key: key, routes: routes, max_trips: max_trips, max_time: max_time}
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)
    lengths = {}
    data["mode"].each do |mode|
      mode["route"].each do |route|
        lengths[route["route_name"]] = {}
        route["direction"].each do |direction|
          direction["trip"].each do |trip|
            lengths[route["route_name"]][trip["trip_headsign"]] ||= []
            lengths[route["route_name"]][trip["trip_headsign"]] << trip["stop"]
          end
        end
      end
    end
    lengths.each do |route,headsigns|
      headsigns.values.select!{ |v| v.length > 4 }
      headsigns.each do |headsign, stops|
        stops.sort!{ |a,b| a.length<=>b.length}
        if(stops.length == 1)
          num = -1
        elsif(stops.length == 2)
          num = -2
        else
          num = -3
        end
        stops[num].each_with_index do |stop,i|
          break if i == stops[num].length - 1
          new_edge =  create_edge(
            @nodes.select{ |node| node[:stop_ids].any?{ |s| s[:id] == stop["stop_id"] } }.first[:node_id],
            @nodes.select{ |node| node[:stop_ids].any?{ |s| s[:id] == stops[num][i + 1]["stop_id"]} }.first[:node_id],
            route,
            ROUTE_COLORS.select{ |r| r[:name] == route }.first[:color],
            route[route])
          if @edges.any?{ |edge| edge == new_edge }
            next
          end
          @edges << new_edge
        end
      end
    end
  end
end

builder = GraphSeeder.new(Route.all)
