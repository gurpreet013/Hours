class Report
  def initialize(entries)
    @entries = entries.map { |e| ReportEntry.new(e) }
  end

  def headers(entry_type)
    header = %w(
      date
      user
      project
      category
      client
      hours
      billable
      billed
      description)
    header.map do |headers|
      I18n.translate("report.headers.#{headers}")
    end
  end

  def each_row(&block)
    @entries.each(&block)
  end
end
