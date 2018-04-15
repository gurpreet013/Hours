module Tickspot
  class ProjectsSyncer < BaseSyncer
    PERMITTED_ATTRIBUTES = [:name, :budget, :created_at, :updated_at]

    ENTRIES_SYNC_RANGE = [Date.parse('1-1-2015'), Date.current]
    private
      def save_record obj
        client = ::Client.find_or_initialize_by(name: obj[:client_name])
        project = client.projects.find_or_initialize_by(name: obj[:name])
        project.assign_attributes(obj.slice(*PERMITTED_ATTRIBUTES))
        project.archived = obj[:closed_on].present?
        client.save!
        fetch_users(project, obj[:id])
        fetch_tasks(project, obj[:id])
        fetch_entries(project, obj[:id])
      end

      def fetch_users project, tickspot_project_id
        UsersSyncer.new(project, project_id: tickspot_project_id).sync
      end

      def fetch_tasks project, tickspot_project_id
        TasksSyncer.new(project, project_id: tickspot_project_id).sync
      end

      def fetch_entries project, tickspot_project_id
        EntriesSyncer.new(project, project_id: tickspot_project_id, start_date: ENTRIES_SYNC_RANGE.first, end_date: ENTRIES_SYNC_RANGE.last).sync
      end
  end
end
