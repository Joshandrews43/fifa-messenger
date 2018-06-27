var http = require('http')
var dataManager = require('./dataManager')
var schedule = require('node-schedule')
var messenger = require('./send_sms')

var earlyDate = new Date(2018, 5, 27, 7, 0, 0)
var ruleEarly = new schedule.RecurrenceRule();
ruleEarly.dayOfWeek = [0, new schedule.Range(0,6)]
ruleEarly.hour = 14
ruleEarly.minute = 1

var lastIdForGoal = 0
var dateLastScored = new Date()

console.log("we're live")

function dataMethod() {	
	console.log("Running scheduled job at " + new Date())		
	dataManager.getData(function(parsedJSON){
		var numActiveGames = parsedJSON.length - 1;
		for(i = 0; i < numActiveGames; i++) {
			if((new Date(parsedJSON[i]["last_score_update_at"])) > dateLastScored) {
				console.log("inside if statement.")
				dateLastScored = new Date(parsedJSON[i]["last_score_update_at"])
				goalWasScored(parsedJSON[i])
			}
		}
	});
}

setInterval(dataMethod, 60000);

 
function goalWasScored(goalData) {

	console.log("inside goal was scored.")
	
	var homeTeam = goalData["home_team_country"];
	var awayTeam = goalData["away_team_country"];

	var homeTeamEvents = goalData["home_team_events"];
	var awayTeamEvents = goalData["away_team_events"];

	var messageText = ""

	for(var i = 0; i < homeTeamEvents.length; i++) {
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
			}
		}
	}

	for(var i = 0; i < awayTeamEvents.length; i++) {
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
			}
		}
	}

	messenger.send_sms(messageText, '+13104248136')
	messenger.send_sms(messageText, '+13109992883')
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

