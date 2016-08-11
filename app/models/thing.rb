class Thing < ActiveRecord::Base
  validates :name, :value, presence: true
end
