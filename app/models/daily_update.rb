class DailyUpdate < ActiveRecord::Base

  include Twitter::Extractor

  #Associations
  belongs_to :user
  has_many :hours, dependent: :destroy
  has_many :taggings, inverse_of: :daily_update
  has_many :tags, through: :taggings

  #Validations
  validates :date, :user, presence: true

  accepts_nested_attributes_for :taggings

  #Scopes
  scope :current_week, -> { where(date: Date.current.all_week) }
  scope :between, ->(from, to) { where(date: from..to) }

  before_save :set_tags_from_description

  accepts_nested_attributes_for :hours, reject_if: :remove_hours_if_empty?, allow_destroy: true

  def remove_hours_if_empty? attributes
    persisted = attributes['id'].present?
    if persisted && attributes['value'].to_i == 0
      attributes.merge!(_destroy: true)
    end
    !persisted && attributes['value'].to_i == 0
  end

  private

    def set_tags_from_description
      tagnames = extract_hashtags(description)
      self.tags = tagnames.map do |tagname|
        Tag.where("name ILIKE ?", tagname.strip).first_or_initialize.tap do |tag|
          tag.name = tagname.strip
          tag.save!
        end
      end
    end

end
