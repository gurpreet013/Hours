class ProjectsSerializer < ActiveModel::Serializer
  attributes :id, :name, :current_week_categories

  has_many :categories

  def current_week_categories
    instance_options[:project_hash][object.id].uniq
  end
end
