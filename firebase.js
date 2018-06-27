//firebase.js
var firebase = require('firebase/app')
var Auth = require("firebase/auth");
var db = require("firebase/database");
var admin = require("firebase-admin");
require('dotenv').config();

var serviceAccount = require("./fifa-messenger-firebase-adminsdk-aewms-1569cfe637.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fifa-messenger.firebaseio.com"
});

var config = {
	apiKey: process.env.firebaseAPIKey,
    authDomain: "fifa-messenger.firebaseapp.com",
    databaseURL: "https://fifa-messenger.firebaseio.com",
    projectId: "fifa-messenger",
    storageBucket: "",
    messagingSenderId: process.env.messagingSenderId
 };

var db = admin.database();
var ref = db.ref("fifa-messenger");
var idRef = ref.child("goalIds")


function isDuplicate(id) {
	var isDuplicate = false;
	ref.child("goalIds").equalTo(id).once("value",snapshot => {
    	const goalData = snapshot.val();
    	if (goalData){
    		console.log("goal already exists! goal number " + id);
    		isDuplicate = true;
    	}
	});
	return isDuplicate
}

module.exports = {
	writeDataToDb: function(id) {
		if(!isDuplicate(id)){
			idRef.push({ id_number : id }, function(error) {
				if(error){
					console.log("ERROR: data not saved successfully: " + error)
				} else {
					console.log("Data saved successfully")
				}
			})	
		}
	}
}

