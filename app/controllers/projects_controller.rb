include TimeSeriesInitializer

class ProjectsController < ApplicationController
  before_action :authenticate_admin!, only: [:new, :create, :edit, :update, :destroy], if: :current_user

  def index
    @projects = current_user.projects.unarchived.by_last_updated.page(params[:page]).per(7)
    @hours_entry = Hour.new
    @mileages_entry = Mileage.new
  end

  def new_index
    default_range = Date.current.all_week
    @from = parse_date(params[:from]) || default_range.first
    @to = parse_date(params[:to]) || default_range.last
    @daily_update_scope = @from && @to ? current_user.daily_updates.between(@from, @to) : current_user.daily_updates.current_week
    @daily_updates = @daily_update_scope.includes(hours: :category)
    @projects = current_user.projects.unarchived.includes(:categories)
    respond_to do |format|
      format.html
      format.js { render json: projects_json_data }
    end
  end

  def show
    @time_series = time_series_for(resource)
  end

  def edit
    resource
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
    if resource.update_attributes(project_params)
      redirect_to project_path(resource), notice: t(:project_updated)
    else
      render action: "edit"
    end
  end

  private

  def entry_type
    request.fullpath == mileage_entry_path ? "mileages" : "hours"
  end

  def resource
    @project ||= Project.find_by_slug(params[:id])
  end

  def project_params
    params.require(:project).
      permit(:name, :billable, :client_id, :archived, :description, :budget, user_ids: [])
  end

  def parse_date(date)
    Date.parse(date) rescue nil
  end

  def projects_json_data
    project_hash = categories_grouped_by_project
    {
      projects: ActiveModel::Serializer::CollectionSerializer.new(@projects, serializer: ProjectsSerializer, project_hash: project_hash),
      hours: @daily_updates.map(&:hours).flatten,
      daily_updates: ActiveModel::Serializer::CollectionSerializer.new(@daily_updates, serializer: DailyUpdateSerializer),
      range: { from: @from, to: @to }
    }
  end

  def categories_grouped_by_project
    project_hash = Hash.new { |hash, key| hash[key] = [] }
    @daily_updates.each do |daily_update|
      daily_update.hours.each do |hour|
        project_hash[hour.project_id] << { name: hour.category.name, id: hour.category_id }
      end
    end
    project_hash
  end

end
