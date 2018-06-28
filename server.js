var http = require('http')
var dataManager = require('./dataManager')
var schedule = require('node-schedule')
var messenger = require('./send_sms')
var firebase = require("./firebase.js")
require('dotenv').config();

var earlyDate = new Date(2018, 5, 27, 7, 0, 0)
var ruleEarly = new schedule.RecurrenceRule();
ruleEarly.dayOfWeek = [0, new schedule.Range(0,6)]
ruleEarly.hour = 14
ruleEarly.minute = 1

var dateLastScored = new Date()
var message;

console.log("We're live")

setInterval(dataMethod, 6000);

function dataMethod() {	
	console.log("Running scheduled job at " + new Date())		
	dataManager.getData(function(parsedJSON){
		var numActiveGames = parsedJSON.length;
		for(i = 0; i < numActiveGames; i++) {
			//come up with good check to lower calls to checkForGoals?
			dataManager.checkForGoals(parsedJSON[i])
		}
	});
}

function sendMessages() {
	//My brother and my phone number.
	messenger.send_sms(message, '+13104248136')
	messenger.send_sms(message, '+13104183319')
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

