class DailyUpdatesController < ApplicationController

  def bulk_update
    if DailyUpdatesManager.bulk_update(params[:daily_updates], current_user_or_impersonated_user)
      render json: { success: "Success" }
    else
      render json: { error: "Error" }, status: 422
    end
  end

end
