require 'net/http'
require 'json'
require 'date'

def seed_all_the_trains!
  modes_and_routes
  add_stops_to_routes
  add_schedule_to_stops
end

def modes_and_routes
  key = "KzJ_jrrznkCJXcIBA3y9lw"
  uri = URI('http://realtime.mbta.com/developer/api/v2/routes')
  params = { :api_key => key}
  uri.query = URI.encode_www_form(params)
  res = Net::HTTP.get_response(uri)

  data = JSON.parse(res.body)
  subways = data["mode"].second["route"] + data["mode"].first["route"].uniq
  commuter_rail = data["mode"].third["route"]

  subway_record = Mode.create(mbta_mode_id: "1", mode_name: "Subway")
  cr_record = Mode.create(mbta_mode_id: "2", mode_name: "Commuter Rail")
  subways.each do |subway_route|
    Route.create(
      route_name: subway_route["route_name"],
      mode: subway_record,
      mbta_route_id: subway_route["route_id"]
    )
    puts "seeding subway route: #{subway_route['route_name']}"
  end

  commuter_rail.each do |cr_route|
    Route.create(
      route_name: cr_route["route_name"],
      mode: cr_record,
      mbta_route_id: cr_route["route_id"]
    )
    puts "seeding commuter rail route: #{cr_route["route_name"]}"
  end
end

def add_stops_to_routes
  Route.all.each do |route|
    key = "KzJ_jrrznkCJXcIBA3y9lw"
    uri = URI('http://realtime.mbta.com/developer/api/v2/stopsbyroute')
    params = { api_key: key, route: route["mbta_route_id"] }
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)

    data["direction"][0]["stop"].each do |stop|
      Stop.create(
        stop_order: stop["stop_order"],
        mbta_stop_id: stop["stop_id"],
        stop_name: stop["stop_name"],
        parent_station: stop["parent_station"],
        parent_station_name: stop["parent_station_name"],
        stop_lat: stop["stop_lat"],
        stop_lon: stop["stop_lon"],
        direction: data["direction"][1]["direction_id"],
        route: route
      )
      puts "seeding outbound station: #{stop["stop_name"]}"
    end

    data["direction"][1]["stop"].each do |stop|
      Stop.create(
        stop_order: stop["stop_order"],
        mbta_stop_id: stop["stop_id"],
        stop_name: stop["stop_name"],
        parent_station: stop["parent_station"],
        parent_station_name: stop["parent_station_name"],
        stop_lat: stop["stop_lat"],
        stop_lon: stop["stop_lon"],
        direction: data["direction"][1]["direction_id"],
        route: route
      )
      puts "seeding inbound station: #{stop["stop_name"]}"
    end

  end
end

def add_schedule_to_stops
  Route.all.each do |route|
    key = "KzJ_jrrznkCJXcIBA3y9lw"
    uri = URI('http://realtime.mbta.com/developer/api/v2/schedulebyroute')
    params = { 
      route: route.mbta_route_id,
      max_time: 1440,
      api_key: key,
      max_trips: 100,
    }
    uri.query = URI.encode_www_form(params)
    res = Net::HTTP.get_response(uri)
    data = JSON.parse(res.body)
    data["direction"].each do |direction|
      direction_record = Direction.create(
        mbta_direction_id: direction["direction_id"],
        direction_name: direction["direction_name"],
        route: route
      )
      direction["trip"].each do |trip|
        trip_record = Trip.create(
          mbta_trip_id: trip["trip_id"],
          trip_name: trip["trip_name"],
          direction: direction_record
        )
        puts "Seeding trip #{trip["trip_id"]}"
        trip["stop"].to_a.each do |event|
          stop = Event.create(
            stop_sequence: event["stop_sequence"],
            mbta_stop_id: event["stop_id"],
            stop_name: event["stop_name"],
            sch_arr_dt: event["sch_arr_dt"],
            sch_dep_dt: event["sch_dep_dt"],
            trip: trip_record
          )
          puts "Seeding event: #{event["stop_id"]} - departure: #{event["sch_dep_dt"]}"
        end
      end
    end
  end
end

seed_all_the_trains!
