class ReplaceUserIdWithDailyUpdateIdInHours < ActiveRecord::Migration
  def change
    add_column :hours, :daily_update_id, :integer
    add_index :hours, :daily_update_id
    remove_column :hours, :user_id, :integer

    add_column :mileages, :daily_update_id, :integer
    add_index :mileages, :daily_update_id
    remove_column :mileages, :user_id, :integer
  end
end
