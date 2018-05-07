class HoursController < EntriesController
  def update
    resource.daily_update = current_user.daily_updates.find_or_create_by(date: parsed_date(:hour))
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
    params.require(:hour).permit(:project_id, :category_id, :value, :date).except!(:date)
  end
end
