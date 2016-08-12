class Api::V1::ThingsController < ActionController::API
  def index
    render json: Thing.all.to_json
  end
end
