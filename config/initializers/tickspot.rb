Tickspot.configure do |config|
  config.company = 'vinsol2'
  config.email = 'gurpreet_013@yahoo.in'
  config.password = 'vinsol123'
end

$tickspot_client = Tickspot::Client.new
