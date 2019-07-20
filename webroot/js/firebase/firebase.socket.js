/*

<button onclick="logMeIn()">log Me In</button>
<button onclick="deleteUserMe();">log Me Out</button>

List All<br>
	<div id='listAll' style="white-space: pre;"></div><br>
List Changes<br>
	<div id='listChanges' style="white-space: pre;"></div>

<!-- Insert these scripts at the bottom of the HTML, but before you use any Firebase services -->
<!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js"></script>
<!-- Add Firebase products that you want to use -->
<script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-firestore.js"></script>

*/

// Your web apps Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDnsAUJoKv3bIlOotsJhAJStXhO22CBqB0",
	authDomain: "warcargo-01.firebaseapp.com",
	databaseURL: "https://warcargo-01.firebaseio.com",
	projectId: "warcargo-01",
	storageBucket: "warcargo-01.appspot.com",
	messagingSenderId: "978330223217",
	appId: "1:978330223217:web:65fd3be35acd315b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

var firestoreUserData = {
	id: null,
	fbData: {},
	fbDataLastSync: {x:-1} // Set x to trigger sync when starting.
}

var firestoreManager = {
	framesSinceLastSync: 0,
	framesToBufferBeforeSync: 0,
	changeDict: {},
	logMeIn: function(sName){
		//debugger;
		firestoreUserData.fbData.name = sName;
		firestoreUserData.fbData.rotation = 0;
		firestoreUserData.fbData.score = 0;
		firestoreUserData.fbData.x = 0;
		firestoreUserData.fbData.y = 0;
		addDataPlayers(firestoreUserData);
	},

	syncUiToFirestoreData: function(oPlayer, iScore) {
		if (this.framesSinceLastSync >= this.framesToBufferBeforeSync) {
			this.framesSinceLastSync = 0;
		} else {
			// Under threashold.
			this.framesSinceLastSync++;
			return;
		}
		if (firestoreUserData.id == null) {
			console.log("player has not logged in")
			return;
		}

		firestoreUserData.fbData.x = Math.round(oPlayer.body.position.x);
		firestoreUserData.fbData.y = Math.round(oPlayer.body.position.y);
		firestoreUserData.fbData.rotation = oPlayer.body.rotation;
		firestoreUserData.fbData.score = iScore;

		if (
			(firestoreUserData.fbData.x == firestoreUserData.fbDataLastSync.x)
			&& (firestoreUserData.fbData.y == firestoreUserData.fbDataLastSync.y)
			&& (firestoreUserData.fbData.rotation == firestoreUserData.fbDataLastSync.rotation)
		) {
			console.log("no changes to player pos.x:" + firestoreUserData.fbData.x)
			return;
		}

		firestoreUserData.fbDataLastSync.x = firestoreUserData.fbData.x;
		firestoreUserData.fbDataLastSync.y = firestoreUserData.fbData.y;
		firestoreUserData.fbDataLastSync.rotation = firestoreUserData.fbData.rotation;

		db.collection("players").doc(firestoreUserData.id).set(firestoreUserData.fbData)
		/* Do not delete  -------------------------
		.then(function() {
			//console.log("Document updated");
		}) end do not delete -------------------- */
		.catch(function(error) {
			console.error("Error updating document: ", error);
		});
	},
	getAllPlayersExceptMe: function() {
		var oOut = {};
		////////var aoFromDb = [];
		debugger;
		db.collection("players").get().then((querySnapshot) => {
		    querySnapshot.forEach((doc) => {
		    	//var dat = {fbId: doc.id, fbData: doc.data()};
		        console.log(`getAllPlayersExceptMe : ${doc.id} => ${doc.data().name}`);
		        //aoFromDb.push(dat)
		        oOut[doc.id] = doc.data();
		    });
			//document.querySelector("#data").innerHTML = JSON.stringify(aoFromDb, null, 3);
		});
		return oOut;
	}
}

/*
player.body.angle
1.5707963267948966
player.body.position.y
 */
db.collection("players").onSnapshot(snapshot => {
	
	var sAll = "<table id=\"playersLoggedIn\">" + socketUiTools.tableHeader;
	snapshot.forEach(row => {
		console.log(row.data());
		sAll += socketUiTools.decorateUserRow(row.ref.id, row.data());
	});
	sAll += "</table>";
	document.querySelector("#listAll").innerHTML = sAll;
	
	// Updates only (shows all at the start)
	let changes = snapshot.docChanges();
	var sChanges = "<table id=\"playerChanges\">" + socketUiTools.tableHeader;
	firestoreManager.changeDict = {};
	
	var FAKEPOS_change_doc_data_x = game.world.centerX;
	var FAKEPOS_change_doc_data_y = game.world.centerY;
	changes.forEach(change => {
		console.log(change.doc.id + " -- " + change.doc.data().name);
		if (
			firestoreUserData.id == null
			|| firestoreUserData.id != change.doc.id
		) {
			if (change.type == 'modified') {
				firestoreManager.changeDict[change.doc.id] = change.doc.data();
			} else if (change.type == 'added') {
				FAKEPOS_change_doc_data_y += 100;
				var otherPlayer = otherPlayers.create(FAKEPOS_change_doc_data_x, FAKEPOS_change_doc_data_y, 'ogre');
				otherPlayer.anchor.setTo(0.39, 0.5);
				otherPlayer.data.fbId = change.doc.id;
				//debugger;
				game.physics.enable(otherPlayer, Phaser.Physics.ARCADE);
				firestoreManager.changeDict[change.doc.id] = change.doc.data();
			} else if (change.type == 'removed') {
				console.log("dsdfdsfdsfdsfs");
				var oData = change.doc.data();
				oData.kill = true;
				debugger;
				firestoreManager.changeDict[change.doc.id] = oData;
			}
		}
		//debugger;
		sChanges += socketUiTools.decorateUserRow(change.doc.id, change.doc.data());
	});
	sChanges += "</table>";
	document.querySelector("#listChanges").innerHTML = sChanges;
});

function onUnload() {
	deleteUserMe();
}

function deleteUser(idUser) {
	db.collection("players").doc(idUser).delete().then(function() {
	    console.log("Document successfully deleted! " +  firestoreUserData.id);
	}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});
}

function deleteUserMe() {
	if (firestoreUserData.id == null) {
		return;
	}
	deleteUser(firestoreUserData.id);
}


var socketUiTools = {
	/* NOTE: This method is overwritten when loading the admin page.*/
	tableHeader: "<tr id=\"header\"><td>name"
			+ "</td><td>score</td><td>x</td></tr>",
	decorateUserRow: function(docId, docData) {
		return "<tr id=\"" + docId + "\" title=\"" + docId + "\" >"
			+ "<td>" + docData.name 
			+ "</td><td>" + docData.score + "</td>"
			+ "<td>" + docData.x + "</td>"
			+ "<td onclick=\"deleteUser(\'" + docId + "\');\">X</td>" 
			+ "</tr>";
	}
}

function addDataPlayers(firestoreUserData) {

	db.collection("players").add(firestoreUserData.fbData)
	.then(function(docRef) {
		console.log("Document written with ID: ", docRef.id);
		firestoreUserData.id = docRef.id;
	})
	.catch(function(error) {
		console.error("Error adding document: ", error);
	});
}
