class Api::V1::ThingsController < ApplicationController
  before_action :authenticate_user
  
  def index
    render json: Thing.all.to_json
  end
end
