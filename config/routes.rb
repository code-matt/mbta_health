Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      mount Knock::Engine => "/knock"
      resources :users, only: [:create]
      resources :things, only: [:index]
      resources :graphs, only: [:index]
    end
  end

  #this is a hack to have angular catch people going directly to a path
  get "/*path" => redirect("/?goto=%{path}")

end
