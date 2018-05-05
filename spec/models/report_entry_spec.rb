describe ReportEntry do
  let(:hour) { create(:hour_with_client) }
  subject(:report_entry) { ReportEntry.new(hour) }

  it "#date localized" do
    expect(report_entry.date).to eq(I18n.l hour.date)
  end

  it "#user" do
    expect(report_entry.user).to eq(hour.user.name)
  end

  it "#project" do
    expect(report_entry.project).to eq(hour.project.name)
  end

  it "#category" do
    expect(report_entry.category).to eq(hour.category.name)
  end

  it "#client" do
    expect(report_entry.client).to eq(hour.project.client.name)
  end

  it "#hours" do
    expect(report_entry.value).to eq(hour.value)
  end

  it "#billable" do
    expect(report_entry.billable).to eq(hour.project.billable)
  end

  it "#description" do
    expect(report_entry.description).to eq(hour.description)
  end

  it "#billable" do
    expect(report_entry.billed).to eq(hour.billed)
  end
end
