class CreateProjectUsers < ActiveRecord::Migration
  def change
    create_table :project_users do |t|
      t.references :user, index: true
      t.references :project, index: true
      t.timestamps null: false
    end
  end
end
