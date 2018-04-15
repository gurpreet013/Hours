class CreateDailyUpdates < ActiveRecord::Migration
  def change
    create_table :daily_updates do |t|
      t.date :date
      t.text :description
      t.references :user, index: true
      t.timestamps null: false
    end
  end
end
