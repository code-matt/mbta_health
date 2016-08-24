class Direction < ActiveRecord::Base
  validates :mbta_direction_id, :direction_name, presence: true
  belongs_to :route
  has_many :trips
end