var unirest = require('unirest')


module.exports = {
	getData: function(callback) {
		unirest.get("https://montanaflynn-fifa-world-cup.p.mashape.com/goals")
		.header("accepts", "json")
		.header("X-Mashape-Key", "eTHpIVqRJimshJLpws9jRoanPUzsp1j2iywjsnALn8JxrO4APS")
		.header("X-Mashape-Host", "montanaflynn-fifa-world-cup.p.mashape.com")
		.end(function (result) {
	 		var jsonText = JSON.stringify(result.body)
	 		var parsedJSON = JSON.parse(jsonText)
	 		callback(parsedJSON)
		});
	},

}

