class Ability
  include CanCan::Ability

  attr_reader :current_user

  def initialize(current_user)
    @current_user = current_user
    current_user.roles.pluck(:name).each do |role|
      send("#{role}_abilities")
    end

  end

  private
    def admin_abilities
      can :manage, :all
    end

    def project_manager_abilities
      can :read, Project, { project_manager_id: current_user.id }
      can :update, Project do |project|
        project.project_manager_id == current_user.id
      end
      can :all_timecards, DailyUpdate
      can :read, Report
      can :read, User, projects: { project_manager_id: current_user.id }
      can [:impersonate, :update], User do |user|
        user.projects.where(project_manager_id: current_user.id).exists?
      end
    end

    def staff_abilities
      can :read, Entry
      can :read, Project, users: { id: current_user.id }
      can [:read, :bulk_update], DailyUpdate
      can [:read, :update, :destroy], Hour, daily_update: { user_id: current_user.id }
      can [:read, :destroy], Entry, daily_update: { current_user_id: current_user.id }
      can :index, User
      can [:show, :update], User do |user|
        current_user.id == user.id
      end
    end
end
