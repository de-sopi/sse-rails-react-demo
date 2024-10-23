Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root 'home#index'

  get 'very_basic', to: 'very_basic#show'

  get 'messages', to: 'messages#index'
  post 'message', to: 'messages#create'
end
