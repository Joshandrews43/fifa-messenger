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


function isDuplicate(id, callback) {
	console.log("Checking for duplicates.")
	var idIsADuplicate = false;
	ref.child("goalIds").orderByChild("id_number").equalTo(id).once("value",snapshot => {
    	const goalData = snapshot.val();
    	if (goalData){
    		console.log("Goal already exists; Goal id: " + id);
    		idIsADuplicate = true;
    	}
    	callback(idIsADuplicate)
	});
}

module.exports = {
	writeDataToDb: function(id) {
		isDuplicate(id, function(idIsADuplicate){
			if(!idIsADuplicate){
				idRef.push({ id_number : id }, function(error) {
					if(error){
						console.log("ERROR: data not saved successfully: " + error)
					} else {
						console.log("Goal " + id + " written to database.")
					}
				})	
			}
		})
	}		
}

