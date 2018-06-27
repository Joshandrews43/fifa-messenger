var http = require('http')
var dataManager = require('./dataManager')
var schedule = require('node-schedule')
var messenger = require('./send_sms')

var earlyDate = new Date(2018, 5, 27, 7, 0, 0)
var ruleEarly = new schedule.RecurrenceRule();
ruleEarly.dayOfWeek = [0, new schedule.Range(0,6)]
ruleEarly.hour = 14
ruleEarly.minute = 1

var awayTeamGoals = 0;
var homeTeamGoals = 0;
var dateLastScored = new Date()
var message;

console.log("we're live")

function dataMethod() {	
	console.log("Running scheduled job at " + new Date())		
	dataManager.getData(function(parsedJSON){
		var numActiveGames = parsedJSON.length - 1;
		for(i = 0; i < numActiveGames; i++) {
			console.log("DateLastScored: " + dateLastScored.getTime() + " & last goal at: " +  new Date(parsedJSON[i]["last_score_update_at"]).getTime())
			if(dateLastScored.getTime() < new Date(parsedJSON[i]["last_score_update_at"]).getTime()) {
				console.log("passed check for time")
				dateLastScored = new Date(parsedJSON[i]["last_score_update_at"])
				checkForGoals(parsedJSON[i])
			}
		}
	});
}

setInterval(dataMethod, 60000);

 
function checkForGoals(goalData) {

	console.log("Inside check for goals.")
	
	var homeTeam = goalData["home_team_country"];
	var awayTeam = goalData["away_team_country"];

	var homeTeamEvents = goalData["home_team_events"];
	var awayTeamEvents = goalData["away_team_events"];

	var messageText = ""

	for(var i = 0; i < homeTeamEvents.length; i++) {
		console.log( "goal for home " + (homeTeamEvents[i]["type_of_event"] == "goal"))
		if(homeTeamEvents[i]["type_of_event"] == "goal") {
			//check if the goal is the most recent update; if yes, new goal scored.
			if(homeTeamEvents[i]["id"] > lastIdForGoal) {
				lastIdForGoal = homeTeamEvents[i]["id"];
				messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
				messageText += String(homeTeamEvents[i]["player"]) + " scores at the " + 
							   String(homeTeamEvents[i]["time"]) + " for " + String(homeTeam) + ".\n" +
							   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
							   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
				console.log(messageText)
				message = messageText
				console.log("sending SMS")
				sendMessages()
			}
		}
	}

	for(var i = 0; i < awayTeamEvents.length; i++) {
		console.log("goal for away_team " + (awayTeamEvents[i]["type_of_event"] == "goal"))
		if(awayTeamEvents[i]["type_of_event"] == "goal") {
			//check if the goal is the most recent update; if yes, new goal scored.
			if(awayTeamEvents[i]["id"] > lastIdForGoal) {
				lastIdForGoal = awayTeamEvents[i]["id"];
				messageText = "" + String(homeTeam) + " vs. " + String(awayTeam) + ":\n";
				messageText += String(awayTeamEvents[i]["player"]) + " scores at the " + 
							   String(awayTeamEvents[i]["time"]) + " for " + String(awayTeam) + ".\n" +
							   String(goalData["home_team"]["code"]) + ": " + goalData["home_team"]["goals"] + " " +
							   String(goalData["away_team"]["code"]) + ": " + goalData["away_team"]["goals"];
				console.log(messageText)
				message = messageText
				console.log("sending SMS")
				sendMessages()
			}
		}
	}
	

}

function sendMessages() {
	messenger.send_sms(message, '+13104248136')
	messenger.send_sms(message, '+13109992883')
}


// Use the environment variable or use a given port
const PORT = process.env.PORT || 8080;

// Create a server, uses `handleRequest` which is function that takes
// care of providing requested data
const server = http.createServer(function(req, res) {
	res.end()
});

// Start the server
server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});

