# frozen_string_literal: true

feature "User manages billables" do
  let(:subdomain) { generate(:subdomain) }

  before(:each) do
    user = build(:user)
    create(:account_with_schema, subdomain: subdomain, owner: user)
    sign_in_user(user, subdomain: subdomain)
  end

  scenario "an overview of all projects with billable hours is shown" do
    client = create(:client)
    project = create(:project, client: client, billable: true)
    project2 = create(:project, client: client, billable: false)
    create(:hour, project: project, billed: false)

    visit billables_url(subdomain: subdomain)

    expect(page).to have_content "Billable Entries"
    expect(page).to have_content project.name
    expect(page).to_not have_content project2.name
  end

  scenario "billable projects that have no billable hours are not shown" do
    client = create(:client)
    project = create(:project, client: client, billable: true)
    project2 = create(:project, client: client, billable: true)
    create(:hour, project: project, billed: false)

    visit billables_url(subdomain: subdomain)

    expect(page).to_not have_content project2.name
  end

  scenario "bill an hours entry" do
    client = create(:client)
    project = create(:project, client: client, billable: true)
    entry = create(:hour, project: project, billed: false)

    visit billables_url(subdomain: subdomain)

    expect(page).to have_content entry.category.name
    expect(page.body).to have_selector(".bill_checkbox")

    find(:css, ".bill_checkbox").set(true)
    find(:css, "#submit-billable-entries-test").click

    expect(entry.reload.billed).to eq(true)
    visit billables_url(subdomain: subdomain)
    expect(page.body).to_not have_selector(".bill_checkbox")
  end
end
