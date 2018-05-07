class RemoveRedundantColumnsFromHours < ActiveRecord::Migration
  def change
    remove_column :hours, :description
    remove_column :hours, :date
  end
end
