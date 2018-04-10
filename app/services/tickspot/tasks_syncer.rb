module Tickspot
  class TasksSyncer < BaseSyncer

    PERMITTED_ATTRIBUTES = [:name]
    private

      def model_class
        Category
      end

      def request_endpoint
        'tasks'
      end

      def save_record obj
        model_obj = model_class.find_or_initialize_by(name: obj[:name])
        model_obj.save!
        model_obj.project_ids = (model_obj.project_ids + [associated_obj.id]).uniq if associated_obj.present?
      end
  end
end
