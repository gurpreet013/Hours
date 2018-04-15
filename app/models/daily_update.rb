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

  accepts_nested_attributes_for :hours, reject_if: :remove_hours_if_empty?, allow_destroy: true

  def remove_hours_if_empty? attributes
    persisted = attributes['id'].present?
    if persisted && attributes['value'].to_i == 0
      attributes.merge!(_destroy: true)
    end
    !persisted && attributes['value'].to_i == 0
  end
end
