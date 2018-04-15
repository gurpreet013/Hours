class CreateCategoryProjects < ActiveRecord::Migration
  def change
    create_table :category_projects do |t|
      t.references :category, index: true
      t.references :project, index: true
      t.timestamps null: false
    end
  end
end
