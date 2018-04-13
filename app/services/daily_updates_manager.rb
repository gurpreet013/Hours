class DailyUpdatesManager
  def self.bulk_update attributes_collection, user
    attributes_collection.values.map do |attributes|
      daily_update = user.daily_updates.find_or_create_by(date: attributes[:date])
      daily_update.assign_attributes(attributes)
      daily_update.save
    end.all?(&:present?)
  end
end
