class TagsController < ApplicationController
  authorize_resource
  
  def show
    @time_series = time_series_for(resource)
  end

  private

  def resource
    @tag ||= Tag.find_by_slug(params[:id].downcase)
  end
end
