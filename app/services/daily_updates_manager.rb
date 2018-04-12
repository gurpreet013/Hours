class DailyUpdatesManager
  def self.bulk_update attributes_collection, current_user
    attributes_collection.map do |attributes|
      daily_update = current_user.daily_updates.find_or_initialize_by(date: attributes[:date])
      daily_update.save(attributes)
    end.all?(&:present?)
  end
end
