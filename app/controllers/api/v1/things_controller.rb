class Api::V1::ThingsController < ApplicationController

  def index
    render json: Thing.all.to_json
  end
end
