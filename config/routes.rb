Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root 'home#index'

  # catch all to not interfere with react router
  # get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }

  namespace :api do
    get 'messages', to: 'messages#index'
    post 'message', to: 'messages#create'
    get 'time', to: 'time#show'
  end
end
