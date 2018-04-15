class TagsController < ApplicationController
  before_action :authenticate_admin!, if: :current_user
  def show
    @time_series = time_series_for(resource)
  end

  private

  def resource
    @tag ||= Tag.find_by_slug(params[:id].downcase)
  end
end
