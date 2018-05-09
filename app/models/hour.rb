# == Schema Information
#
# Table name: hours
#
#  id          :integer          not null, primary key
#  project_id  :integer          not null
#  category_id :integer          not null
#  user_id     :integer          not null
#  value       :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#  billed      :boolean          default("false")
#

class Hour < Entry
  audited allow_mass_assignment: true

  belongs_to :category

  validates :category, presence: true

  scope :by_last_created_at, -> { order("created_at DESC") }
  scope :by_date, -> { joins(:daily_update).order("daily_updates.date DESC") }
  scope :billable, -> { where("billable").joins(:project) }
  scope :with_clients, -> {
    where.not("projects.client_id" => nil).joins(:project)
  }

  delegate :description, :date, to: :daily_update

  def tag_list
    tags.map(&:name).join(", ")
  end

  def self.query(params, includes = nil)
    EntryQuery.new(self.includes(includes).by_date, params, "hours").filter
  end
end
