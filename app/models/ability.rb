class Ability
  include CanCan::Ability

  attr_reader :user

  def initialize(user)
    @user = user
    user.roles.pluck(:name).each do |role|
      send("#{role}_abilities")
    end

  end

  private
    def admin_abilities
      can :manage, :all
    end

    def project_manager_abilities
    end

    def staff_abilities
      can :read, Entry
      can [:read, :bulk_update], DailyUpdate
      can [:read, :update, :destroy], Hour, daily_update: { user_id: user.id }
      can [:read, :destroy], Entry, daily_update: { user_id: user.id }
      can [:show, :update, :edit], User do |current_user|
        user.id == current_user.id
      end
    end
end
