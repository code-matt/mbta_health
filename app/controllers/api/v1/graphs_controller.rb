class Api::V1::GraphsController < ApplicationController
  def index
    render json: {
      nodes: GRAPH_DATA.nodes,
      edges: GRAPH_DATA.edges}
  end
end