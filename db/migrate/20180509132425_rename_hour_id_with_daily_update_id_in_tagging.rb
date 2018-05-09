class RenameHourIdWithDailyUpdateIdInTagging < ActiveRecord::Migration
  def change
    rename_column :taggings, :hour_id, :daily_update_id
  end
end
