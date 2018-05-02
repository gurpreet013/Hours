class DailyUpdatesController < ApplicationController
  before_action :set_date_range, only: [:index]

  def index
    @users_with_daily_updates = users_scope.eager_load(daily_updates: :hours).merge(DailyUpdate.between(@from, @to)).select(:id, :first_name, :last_name)
    @users_with_daily_updates = @users_with_daily_updates.presence || [current_user_or_impersonated_user]
    @users_with_projects = users_scope.eager_load(projects: :categories).merge(Project.unarchived).order('project_users.created_at')
    respond_to do |format|
      format.html
      format.js { render json: { users: projects_json_data, collection: params[:all].present?, readonly: (params[:all] || params[:readonly]).present? } }
    end
  end

  def bulk_update
    if DailyUpdatesManager.bulk_update(params[:daily_updates], current_user_or_impersonated_user)
      render json: { success: "Success" }
    else
      render json: { error: "Error" }, status: 422
    end
  end

  private

    def projects_json_data
      project_hash = categories_grouped_by_project
      users_projects_hash = projects_grouped_by_user
      @users_with_daily_updates.map do |user|
        {
          user: {
            full_name: user.full_name,
            admin: current_user.admin,
            slug: user.slug
          },
          projects: ActiveModel::Serializer::CollectionSerializer.new(users_projects_hash[user.id] || [], serializer: ProjectsSerializer, project_hash: project_hash[user.id]),
          hours: user.daily_updates.map(&:hours).flatten,
          daily_updates: ActiveModel::Serializer::CollectionSerializer.new(user.daily_updates, serializer: DailyUpdateSerializer),
          range: { from: @from, to: @to }
        }
      end
    end

    def categories_grouped_by_project
      all_users_project_hash = Hash.new { |hash, key| hash[key] = Hash.new { |h, k| h[k] = [] } }
      all_user_used_tasks = users_scope.joins(daily_updates: [hours: [:category, :project]]).merge(Project.unarchived)
                                        .select(:'users.id', :project_id, :category_id, :'categories.name').uniq
      all_user_used_tasks.each do |user_used_task|
        all_users_project_hash[user_used_task.id][user_used_task.project_id] << { name: user_used_task.attributes['name'], id: user_used_task.category_id }
      end
      all_users_project_hash
    end

    def projects_grouped_by_user
      users_hash = {}
      @users_with_projects.each do |user|
        users_hash[user.id] = user.projects
      end
      users_hash
    end

    def set_date_range
      default_range = Date.current.all_week
      @from = parse_date(params[:from]) || default_range.first
      @to = parse_date(params[:to]) || default_range.last
    end

    def users_scope
      params[:all] ? User.all : User.where(id: current_user_or_impersonated_user.id)
    end

end
