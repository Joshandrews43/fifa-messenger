var unirest = require('unirest')

var currentMatchesURL = "https://worldcup.sfg.io/matches/current"

module.exports = {
	getData: function(callback) {
		unirest.get(currentMatchesURL)
		.end(function(result) {
			//store match data in json
			var parsedJson = JSON.parse(result["raw_body"])
			//console.log(parsedJson[0])
			callback(parsedJson)
		})
	}
}

