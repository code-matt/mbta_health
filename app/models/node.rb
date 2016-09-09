class Node < ActiveRecord::Base
  serialize :stop_ids, JSON
end