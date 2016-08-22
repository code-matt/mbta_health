class Mode < ActiveRecord::Base
  validates :mode_name, :mbta_mode_id, presence: true
  has_many :routes
end