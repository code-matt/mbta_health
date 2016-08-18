class Api::V1::UsersController < ApplicationController

  def create
    user = User.new(
      email: params[:auth][:email],
      password: params[:auth][:password])
    if user.valid? 
      user.save
      render json: {status: "success!"}
    else
      render json: {errors: user.errors}
    end
  end

end