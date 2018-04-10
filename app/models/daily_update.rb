class DailyUpdate < ActiveRecord::Base
  #Associations
  belongs_to :user
  has_many :hours, dependent: :destroy
  has_many :mileages, dependent: :destroy


  #Validations
  validates :date, :user, presence: true

  #Scopes
  scope :current_week, -> { where(date: Date.current.all_week) }
  scope :between, ->(from, to) { where(date: from..to) }
end
