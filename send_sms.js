//send_sms.js

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
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