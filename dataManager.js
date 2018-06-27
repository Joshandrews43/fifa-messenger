var unirest = require('unirest')

var currentMatchesURL = "https://worldcup.sfg.io/matches/current"

module.exports = {
	getData: function(callback) {
		unirest.get("https://worldcup.sfg.io/matches?start_date=2018-06-19&end_date=2018-06-20")
		.end(function(result) {
			//store match data in json
			var parsedJson = JSON.parse(result["raw_body"])
			callback(parsedJson)
		})
	}
}

