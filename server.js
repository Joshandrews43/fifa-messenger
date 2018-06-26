var http = require('http')
var getData = require('./getData')
var schedule = require('node-schedule')

var earlyDate = new Date(2018, 5, 27, 7, 0, 0)
var lateDate = new Date(2018, 5, 27, 11, 0, 0)
var ruleEarly = new schedule.RecurrenceRule();
ruleEarly.dayOfWeek = [0, new schedule.Range(0,6)]
ruleEarly.hour = 16
ruleEarly.minute = 18
ruleEarly.second = 55
ruleLate = new schedule.RecurrenceRule();
ruleLate.hour = 11
ruleLate.minute = 0

var lastGoalScored = 0


var testJSON = { id: 171,
				 person_id: 82,
				 game_id: 64,
				 team_id: 127,
				 minute: 113,
				 score1: 1,
				 score2: 0,
				 penalty: 'f',
				 owngoal: 'f',
				 created_at: '2014-11-28 11:46:31.197171',
				 updated_at: '2014-11-28 11:46:31.197171' }

function dataMethod() {			
	getData.getData(function(parsedJSON) {
		console.log(parsedJSON[parsedJSON.length-1])

		if(lastGoalScored == 0) {
 			lastGoalScored = parsedJSON[parsedJSON.length-1]
		}

		if(lastGoalScored["id"] == parsedJSON[parsedJSON.length-1]["id"]) {
			console.log("no goals scored in last minute")
		} else {
			console.log("goal was scored")
			lastGoalScored = parsedJSON[parsedJSON.length-1]
			goalWasScored(lastGoalScored)
		}

		

		})
}

var x = schedule.scheduleJob(ruleEarly, function() {
		setInterval(dataMethod, 10000);
	})
 
function goalWasScored(goalData) {

}


// Use the environment variable or use a given port
const PORT = process.env.PORT || 8080;

// Create a server, uses `handleRequest` which is function that takes
// care of providing requested data
const server = http.createServer(function(req, res) {
	res.write("hello")
	res.end()
});

// Start the server
server.listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});

