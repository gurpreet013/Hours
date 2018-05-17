include TimeSeriesInitializer

class UsersController < ApplicationController
  authorize_resource
  before_action :find_resource, only: [:show, :edit, :update, :projects]

  def show
    @time_series = time_series_for(@user)
  end

  def index
    @users = User.all.accessible_by(current_ability)
  end

  def edit
  end

  def update
    if @user.respond_to?(:unconfirmed_email)
      prev_unconfirmed_email = @user.unconfirmed_email
    end

    if @user.update_with_password(user_params)
      flash_key = if update_needs_confirmation?(@user, prev_unconfirmed_email)
                    :update_needs_confirmation
                  else
                    :updated
                  end
      redirect_to edit_user_path(@user), notice: t(".#{flash_key}")
    else
      render :edit
    end
  end

  def projects
    @all_clients = Client.includes(:projects).all
  end

  private

  def find_resource
    @user ||= User.find_by_slug(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name,
                                 :last_name,
                                 :email,
                                 :password,
                                 :password_confirmation,
                                 :current_password,
                                 role_ids: [],
                                 project_ids: [])
  end

  def update_needs_confirmation?(resource, previous)
    resource.respond_to?(:pending_reconfirmation?) &&
      resource.pending_reconfirmation? &&
      previous != resource.unconfirmed_email
  end
end
