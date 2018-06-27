//send_sms.js

// const accountSid = process.env.accountSid;
// const authToken = process.env.authToken;
const accountSid = "AC9a24fbbe2fc06def60f6bef30141513c";
const authToken = "e7fcb75012b8e39b5377ae135d5d5348";
const client = require('twilio')(accountSid, authToken);


module.exports = {
	send_sms: function(bodyText, phoneNumber) {
		//console.log("composing message with text: " + bodyText)
		client.messages.create({
	     body: '' + bodyText,
	     from: '+18188627338',
	     to: '' + phoneNumber
	   })
	  .then(message => console.log(message.sid + "message sent"))
	  .done();
	}
}