class CategoryProject < ActiveRecord::Base
  belongs_to :project
  belongs_to :category

  validates :project, :category, presence: true
end
