class Trip < ActiveRecord::Base
  validates :trip_name, :mbta_trip_id, presence: true
  belongs_to :direction
  has_many :events
end