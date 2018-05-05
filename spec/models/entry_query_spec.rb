describe EntryQuery do
  let(:client) { create(:client) }
  let(:project) { create(:project, archived: true, client: client) }
  let!(:hour) do
    create(:hour, billed: false, project: project, date: 20.days.ago)
  end
  let!(:hour2) { create(:hour, billed: true, date: 10.days.ago) }
  let(:params) { {} }

  describe "#filter" do
    it "filters the entries on project id" do
      expect(hours_filter(project_id: hour.project.id).count).to eq(1)
    end

    it "filters the entries on client_id" do
      expect(hours_filter(client_id: hour.client.id).count).to eq(1)
    end

    it "filters the entries on from_date" do
      expect(hours_filter(from_date: hour.date + 1.day).count).to eq(1)
    end

    it "filters the entries on to date" do
      expect(hours_filter(to_date: hour2.date - 1.day).count).to eq(1)
    end

    it "filters the entries on not billed" do
      expect(hours_filter(billed: hour.billed).count).to eq(1)
    end

    it "filters the entries on archived" do
      expect(hours_filter(archived: true).count).to eq(1)
    end

    it "filters on all params" do
      expect(hours_filter(
        billed: hour.billed,
        to_date: hour2.date + 1.day,
        from_date: hour.date - 1.day,
        client_id: hour.client.id,
        project_id: hour.project.id
      ).count).to eq(1)
    end

    def hours_filter(params)
      EntryQuery.new(Hour.all, params, "hours").filter
    end
  end
end
