class Route < ActiveRecord::Base
  attr_reader :inbound, :outbound
  
  validates :route_name, :mbta_route_id, presence: true
  belongs_to :mode
  has_many :directions

  def inbound
    directions[1]
  end

  def outbound
    directions[0]
  end
end