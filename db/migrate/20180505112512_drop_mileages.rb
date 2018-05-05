class DropMileages < ActiveRecord::Migration
  def change
    drop_table :mileages
  end
end
