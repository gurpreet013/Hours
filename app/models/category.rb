# == Schema Information
#
# Table name: categories
#
#  id         :integer          not null, primary key
#  name       :string           default(""), not null
#  created_at :datetime
#  updated_at :datetime
#

class Category < ActiveRecord::Base
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  scope :by_name, -> { order("lower(name)") }
  has_many :hours
  has_many :category_projects, dependent: :destroy
  has_many :projects, through: :category_projects

  def label
    name
  end
end
