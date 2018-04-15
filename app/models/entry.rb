class Entry < ActiveRecord::Base
  self.abstract_class = true

  include Twitter::Extractor

  validates :daily_update, :project, :date, presence: true
  validates :value, presence: true, numericality: { greater_than: 0,
                                                    only_integer: true }

  audited allow_mass_assignment: true

  has_one :client, through: :project

  belongs_to :daily_update, touch: true
  belongs_to :project, touch: true
  has_one :user, through: :daily_update
end
