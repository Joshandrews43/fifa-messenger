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

setInterval(dataMethod, 60000);
setInterval(function() {
    http.get("http://fifa-messenger.herokuapp.com");
}, 300000);

function dataMethod() {	
	dataManager.getData(function(parsedJSON){
		var numActiveGames = parsedJSON.length;
		for(i = 0; i < numActiveGames; i++) {
			//come up with good check to lower calls to checkForGoals?
			dataManager.checkForGoals(parsedJSON[i])
		}
	});
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

