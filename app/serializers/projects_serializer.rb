class ProjectsSerializer < ActiveModel::Serializer
  attributes :id, :name, :categories

  def categories
    instance_options[:project_hash][object.id].uniq
  end
end
