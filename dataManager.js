var unirest = require('unirest')
var firebase = require('./firebase.js')
var messenger = require('./send_sms.js')

var currentMatchesURL = "https://worldcup.sfg.io/matches/current"

var lastIdForGoal = 0;

function sendMessages() {
	//My brother and my phone number.
	messenger.send_sms(message, '+13104248136')
	messenger.send_sms(message, '+13104183319')
	messenger.send_sms(message, '+13109992883')
}

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

		var goalScored = false;
		
		var homeTeam = goalData["home_team_country"];
		var awayTeam = goalData["away_team_country"];

		console.log("Running checkForGoals for " + goalData["home_team"]["code"]  + " vs. " + goalData["away_team"]["code"] + " at " + new Date())

		var homeTeamEvents = goalData["home_team_events"];
		var awayTeamEvents = goalData["away_team_events"];

		var messageText = ""

		for(var i = 0; i < homeTeamEvents.length; i++) {
			if(homeTeamEvents[i]["type_of_event"] == "goal") {
				//check if the goal is the most recent update; if yes, new goal scored.
				if(homeTeamEvents[i]["id"] > lastIdForGoal) {
					goalScored = true
					console.log("New goal scored with newer id: " + homeTeamEvents[i]["id"])
					firebase.writeDataToDb(homeTeamEvents[i]["id"])

					lastIdForGoal = homeTeamEvents[i]["id"];
					messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
					messageText += String(homeTeamEvents[i]["player"]) + " scores at the " + 
								   String(homeTeamEvents[i]["time"]) + " for " + String(homeTeam) + ".\n" +
								   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
								   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
					message = messageText
					console.log("sending SMS with text:\n" + message)
					sendMessages()
				}
			}
		}

		for(var i = 0; i < awayTeamEvents.length; i++) {
			if(awayTeamEvents[i]["type_of_event"] == "goal") {
				//check if the goal is the most recent update; if yes, new goal scored.
				if(awayTeamEvents[i]["id"] > lastIdForGoal) {
					goalScored = true
					console.log("New goal scored with newer id: " + awayTeamEvents[i]["id"])

					firebase.writeDataToDb(awayTeamEvents[i]["id"])

					lastIdForGoal = awayTeamEvents[i]["id"];
					messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
					messageText += String(awayTeamEvents[i]["player"]) + " scores at the " + 
								   String(awayTeamEvents[i]["time"]) + " for " + String(awayTeam) + ".\n" +
								   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
								   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
					message = messageText
					console.log("sending SMS with text:\n" + message)
					sendMessages()
				}
			}
		}
		if(!goalScored) { console.log("No goals scored at " + goalData["time"] + " for " + goalData["home_team"]["code"] + " vs. " + goalData["away_team"]["code"])  } 
	}
}

