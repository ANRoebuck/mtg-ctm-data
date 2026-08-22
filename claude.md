The neighbouring project, mtg-ctm-be, contains an API.md file detailing how that application receives and responds to data requests.

Build a react app which connects to that application making only GET requests querying the available data and visualising it. Make the display customisable in whatever way is useful to the user.

The back-end we're connecting to will be hosted somewhere, but for now just assume it's running on localhost. Any reference to localhost should be via a base_url variable which is defined in one place.

Generate some dummy data that can be used in local testing, with a simple toggle to show the test data instead of trying to get live data.

If the app ever fails to connect to the backend, it should display an appropriate warning.
