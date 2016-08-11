Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :things, only: [:index]
    end
  end

  #this is a hack to have angular catch people going directly to a path
  get "/*path" => redirect("/?goto=%{path}")

end
