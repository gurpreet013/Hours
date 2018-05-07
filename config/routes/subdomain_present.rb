devise_for :users, controllers: { registrations: "users/registrations" }
resources :archives, only: [:index]
resources :projects, only: [:index, :edit, :new, :update, :create, :show] do
  resources :audits, only: [:index]
end
resources :daily_updates, only: :index do
  collection do
    get :all_timecards
    post :bulk_update
  end
end
resources :categories, only: [:index, :create, :edit, :update]
resources :entries, only: [:index]

resources :hours, only: [:destroy, :update, :edit, :patch] do
  resources :audits, only: [:index]
end

resources :reports, only: [:index]

resources :billables, only: [:index]

resources :users, only: [:index, :update, :show, :edit] do
  member do
    get :projects
  end
  resources :entries, only: [:index]
end

resources :tags, only: [:show]
resources :clients, only: [:show, :index, :edit, :update, :create]

get "account/edit" => "accounts#edit", as: :edit_account
delete "account" => "accounts#destroy", as: :destroy_account
post "billables" => "billables#bill_entries", as: :bill_entries
