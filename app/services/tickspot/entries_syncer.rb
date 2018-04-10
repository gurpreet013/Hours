module Tickspot
  class EntriesSyncer < BaseSyncer

    private
      def save_record obj
        user = User.find_by(email: obj[:user_email][:__content__])
        project = Project.find_by(name: obj[:project_name][:__content__])
        if user && project
          category = project.categories.find_by(name: obj[:task_name])
          daily_update = user.daily_updates.find_or_create_by(date: obj[:date])
          hour = daily_update.hours.find_or_initialize_by(category_id: category.id, project_id: project.id)
          hour.value = obj[:hours].to_i
          hour.date = obj[:date]
          daily_update.description = daily_update.description.to_s.concat('\n', obj[:notes][:__content__].to_s) if obj[:notes].present?
          daily_update.save
          hour.save
        end
      end
  end
end
