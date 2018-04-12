# class DailyUpdatesController < ApplicationController
#
#   def bulk_update
#     if DailyUpdatesManager.bulk_update(bulk_update_params)
#       render json: { success: "Success" }
#     else
#       render json: { error: "Error" }, status: 422
#     end
#   end
#
#   private
#     def bulk_update_params
#       params.require(:daily_updates).permit(:date, hours_attributes: [:id, :_destroy, :value, :project_id, :client_id])
#     end
# end
