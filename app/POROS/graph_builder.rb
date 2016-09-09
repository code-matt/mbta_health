require 'json'

class GraphBuilder
  attr_reader :nodes, :edges

  def initialize
    @nodes = []
    @edges = []

    db_to_const
  end

  def db_to_const
    Node.all.each do |node|
      @nodes << {
        x: node.x,
        y: node.y,
        stop_name: node.stop_name,
        node_id: node.node_id,
        stop_ids: JSON.parse(node.stop_ids)
      }
    end

    Edge.all.each do |edge|
      @edges << {
        to: edge.to,
        from: edge.from,
        route: edge.route,
        color: edge.color,
        routeId: edge.routeId
      }
    end
  end
  
end