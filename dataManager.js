var unirest = require('unirest')
var firebase = require('./firebase.js')

var currentMatchesURL = "https://worldcup.sfg.io/matches/current"

var lastIdForGoal = 0;

module.exports = {
	getData: function(callback) {
		unirest.get(currentMatchesURL)
		.end(function(result) {
			//store match data in json
			var parsedJson = JSON.parse(result["raw_body"])
			//console.log(parsedJson[0])
			callback(parsedJson)
		})
	},
	checkForGoals: function(goalData) {

		console.log("Running checkForGoals.")
		
		var homeTeam = goalData["home_team_country"];
		var awayTeam = goalData["away_team_country"];

		var homeTeamEvents = goalData["home_team_events"];
		var awayTeamEvents = goalData["away_team_events"];

		var messageText = ""

		for(var i = 0; i < homeTeamEvents.length; i++) {
			if(homeTeamEvents[i]["type_of_event"] == "goal") {
				//console.log(homeTeamEvents[i]["type_of_event"])
				//check if the goal is the most recent update; if yes, new goal scored.
				if(homeTeamEvents[i]["id"] > lastIdForGoal) {
					
					firebase.writeDataToDb(homeTeamEvents[i]["id"])

					lastIdForGoal = homeTeamEvents[i]["id"];
					messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
					messageText += String(homeTeamEvents[i]["player"]) + " scores at the " + 
								   String(homeTeamEvents[i]["time"]) + " for " + String(homeTeam) + ".\n" +
								   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
								   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
					message = messageText
					console.log("sending SMS with text: " + message)
					//sendMessages()
				} else {
					//console.log("No new home goals for " + goalData["home_team"]["code"])
				}
			}
		}

		for(var i = 0; i < awayTeamEvents.length; i++) {
			if(awayTeamEvents[i]["type_of_event"] == "goal") {
				//console.log(awayTeamEvents[i]["type_of_event"])

				//check if the goal is the most recent update; if yes, new goal scored.
				if(awayTeamEvents[i]["id"] > lastIdForGoal) {

					firebase.writeDataToDb(awayTeamEvents[i]["id"])

					lastIdForGoal = awayTeamEvents[i]["id"];
					messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
					messageText += String(awayTeamEvents[i]["player"]) + " scores at the " + 
								   String(awayTeamEvents[i]["time"]) + " for " + String(awayTeam) + ".\n" +
								   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
								   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
					message = messageText
					console.log("sending SMS with text: " + message)
					//sendMessages()
				} else {
					//console.log("No new away goals for " + goalData["away_team"]["code"])
				}
			}
		}
	}
}

