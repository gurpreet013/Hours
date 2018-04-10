class HoursController < EntriesController
  def create
    daily_update = current_user.daily_updates.find_or_initialize_by(date: entry_params[:date])
    daily_update.description = entry_params[:description]
    hour = Hour.new(entry_params)
    hour.daily_update = daily_update
    if hour.save
      redirect_to root_path, notice: t("entry_created.hours")
    else
      redirect_to root_path, notice: daily_update.errors.full_messages.join(". ")
    end
  end

  def update
    if resource.update_attributes(entry_params)
      redirect_to user_entries_path(current_user), notice: t("entry_saved")
    else
      redirect_to edit_hour_path(resource), notice: t("entry_failed")
    end
  end

  def edit
    super
    resource
  end

  private

  def resource
    @hours_entry ||= current_user.hours.find(params[:id])
  end

  def entry_params
    params.require(:hour).
      permit(:project_id, :category_id, :value, :description, :date).
      merge(date: parsed_date(:hour))
  end
end
