class Stop < ActiveRecord::Base
  validates :stop_order, :mbta_stop_id, :stop_name, :stop_lat, :stop_lon, presence: true
  validates :parent_station, :parent_station_name, presence: true, allow_blank: true
  belongs_to :route
end