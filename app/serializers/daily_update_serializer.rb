class DailyUpdateSerializer < ActiveModel::Serializer

  attributes :id, :date, :description

  def initialize *args
    super
    debugger
  end
end
