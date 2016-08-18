class Api::V1::UsersController < ApplicationController

  def create
    user = User.new(user_params)
    if user.valid? 
      user.save
      render json: {status: "success!"}
    else
      render json: {errors: user.errors}
    end
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end
end