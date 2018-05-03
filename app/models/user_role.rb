class UserRole < ActiveRecord::Base

  #Associations
  belongs_to :user
  belongs_to :role

  #Validations
  validates :user, :role, presence: true

end
