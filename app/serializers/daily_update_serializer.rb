class DailyUpdateSerializer < ActiveModel::Serializer
  attributes :id, :date, :description
end
