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

    outbound = Direction.create(
      mbta_direction_id: data["direction"][0]["direction_id"],
      direction_name: data["direction"][0]["direction_name"],
      route: route
    )

    data["direction"][0]["stop"].each do |stop|
      Stop.create(
        stop_order: stop["stop_order"],
        mbta_stop_id: stop["stop_id"],
        stop_name: stop["stop_name"],
        parent_station: stop["parent_station"],
        parent_station_name: stop["parent_station_name"],
        stop_lat: stop["stop_lat"],
        stop_lon: stop["stop_lon"],
        direction: outbound
      )
      puts "seeding outbound station: #{stop["stop_name"]}"
    end

    inbound = Direction.create(
      mbta_direction_id: data["direction"][1]["direction_id"],
      direction_name: data["direction"][1]["direction_name"],
      route: route
    )

    data["direction"][1]["stop"].each do |stop|
      Stop.create(
        stop_order: stop["stop_order"],
        mbta_stop_id: stop["stop_id"],
        stop_name: stop["stop_name"],
        parent_station: stop["parent_station"],
        parent_station_name: stop["parent_station_name"],
        stop_lat: stop["stop_lat"],
        stop_lon: stop["stop_lon"],
        direction: inbound
      )
      puts "seeding inbound station: #{stop["stop_name"]}"
    end

  end
end

def add_schedule_to_stops
  Stop.all.each do |stop|
    next if stop.direction.route.mode.mode_name == "Subway"
    datetime = DateTime.strptime("#{Time.now.to_i}",'%s').prev_day
    1.times do |day|
      datetime = datetime.next_day
      key = "KzJ_jrrznkCJXcIBA3y9lw"
      uri = URI('http://realtime.mbta.com/developer/api/v2/schedulebystop')
      params = { 
        stop: stop.mbta_stop_id,
        max_time: 1440,
        api_key: key,
        max_trips: 30,
        datetime: datetime.to_time.to_i,
      }
      uri.query = URI.encode_www_form(params)
      res = Net::HTTP.get_response(uri)
      data = JSON.parse(res.body)
      data['mode'].first["route"].first["direction"].each do |direction|
        next if stop.direction.mbta_direction_id != direction["direction_id"]
        direction["trip"].each do |event|
          if Event.where('trip_name LIKE ?', event["trip_name"]).all.length == 0
            Event.create(
              mbta_trip_id: event["trip_id"],
              trip_name: event["trip_name"],
              sch_arr_dt: event["sch_arr_dt"],
              sch_dep_dt: event["sch_dep_dt"],
              stop: stop
            )
            puts "Seeding arrival/depature: #{event["trip_name"]}"
          end
        end
      end
    end
  end
end

seed_all_the_trains!
#mode -> route -> direction -> stop-> event
# Event.where('trip_name LIKE ?', Event.parse_trip_name("771 (3:30 pm from South Station)"))
# Stop.new(stop_order: stop["stop_order"],mbta_stop_id: stop["stop_id"],stop_name: stop["stop_name"],parent_station: stop["parent_station"],parent_station_name: stop["parent_station_name"],stop_lat: stop["stop_lat"],stop_lon: stop["stop_lon"],direction: outbound)
