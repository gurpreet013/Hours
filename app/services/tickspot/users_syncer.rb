module Tickspot
  class UsersSyncer < BaseSyncer

    PERMITTED_ATTRIBUTES = [:first_name, :last_name, :email]

    private
      def save_record obj
        model_obj = model_class.find_or_initialize_by(email: obj['email'])
        model_obj.assign_attributes(obj.slice(*PERMITTED_ATTRIBUTES))
        model_obj.password = obj[:email] unless model_obj.persisted?
        model_obj.save!
        model_obj.project_ids = (model_obj.project_ids + [associated_obj.id]).uniq if associated_obj.present?
      end
  end
end
