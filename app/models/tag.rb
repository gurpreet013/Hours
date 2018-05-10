# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime
#  updated_at :datetime
#  slug       :string
#

class Tag < ActiveRecord::Base
  attr_reader :total_hours
  include Sluggable

  validates :name, presence: true,
                   uniqueness: { case_sensitive: false }

  has_many :taggings
  has_many :daily_updates, through: :taggings
  has_many :hours, through: :daily_updates
  has_many :projects, -> { uniq }, through: :hours
  has_many :users, -> { uniq }, through: :daily_updates

  def self.list
    Tag.order(:name).pluck(:name)
  end

  private

  def slug_source
    name
  end
end
