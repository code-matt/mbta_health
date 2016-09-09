class Route < ActiveRecord::Base
  validates :route_name, :mbta_route_id, presence: true
  belongs_to :mode
  has_many :stops
end