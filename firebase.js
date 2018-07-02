//firebase.js
var firebase = require('firebase/app')
var Auth = require("firebase/auth");
var db = require("firebase/database");
var admin = require("firebase-admin");
require('dotenv').config();

console.log(require("./fifa-messenger-b883a-firebase-adminsdk-fudi6-e46fb188c3.js"));
var serviceAccount = require("./fifa-messenger-b883a-firebase-adminsdk-fudi6-e46fb188c3.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fifa-messenger-b883a.firebaseio.com"
});

 var config = {
    apiKey: "AIzaSyDk6Ep7s4ihrU5J2yKX39a1bCNJmPrQyXc",
    authDomain: "fifa-messenger-b883a.firebaseapp.com",
    databaseURL: "https://fifa-messenger-b883a.firebaseio.com",
    projectId: "fifa-messenger-b883a",
    storageBucket: "fifa-messenger-b883a.appspot.com",
    messagingSenderId: "163905594053"
  };

var db = admin.database();
var ref = db.ref("fifa-messenger-b883a");
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

