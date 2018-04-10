module Tickspot
  class BaseSyncer
    attr_reader :arguments, :associated_obj

    def initialize associated_obj=nil, arguments={}
      @associated_obj = associated_obj
      @arguments = arguments
    end

    def model_class
      @model_class ||= self.class.name.remove('Syncer').singularize.remove('Tickspot::').safe_constantize
    end

    def sync
      @data = fetch_data_from_tickspot
      if @data.present?
        @data.each do |obj|
          save_record(obj.dup.with_indifferent_access)
        end
      end
    end

    def fetch_data_from_tickspot
      $tickspot_client.public_send("#{request_endpoint}", arguments)
    end

    def save_record obj
    end

    def request_endpoint
      model_class.name.downcase.pluralize if model_class
    end
  end
end
