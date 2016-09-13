class StatusTracker
  attr_accessor :status

  def initialize
    @status = 0
  end

  def broadcast
    ActionCable.server.broadcast('status',@status)
  end
end