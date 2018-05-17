include TimeSeriesInitializer

class ProjectsController < ApplicationController
  before_action :load_resource, only: [:show, :edit, :update]
  authorize_resource

  def index
    @projects = Project.accessible_by(current_ability).includes(:client, hours: :category).unarchived.by_last_updated.page(params[:page]).per(7)
  end

  def show
    @time_series = time_series_for(@project)
  end

  def edit
    @project
  end

  def new
    @project = Project.new
  end

  def create
    @project = Project.new(project_params)
    if @project.save
      redirect_to root_path, notice: t(:project_created)
    else
      render action: "new"
    end
  end

  def update
    if @project.update_attributes(project_params)
      redirect_to project_path(@project), notice: t(:project_updated)
    else
      render action: "edit"
    end
  end

  private

  def load_resource
    @project ||= Project.find_by_slug(params[:id])
  end

  def project_params
    params.require(:project).
      permit(:name, :billable, :client_id, :archived, :description, :budget, :project_manager_id, user_ids: [])
  end

end
