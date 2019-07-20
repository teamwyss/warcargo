

var gameController = {
	startGame: function() {
		if (this.logInPlayer()) {
			
			
			setTimeout(function() {	
				mainMenu.hide();
				enemyStatus.chaseSpeed = enemyStatus.chaseSpeedDefault;
			}, 1000)
		
		
		}
	},
	pauseGame: function() {
		this.endGame();
	},
	endGame: function() {
		mainMenu.show();
		enemyStatus.chaseSpeed = 0;
	},
	logInPlayer: function() {
		var playerName = util.el("#playerNameLoginField").value;
		if (playerName == "") {
			alert("please enter name");
			return false;
		}
		if (firestoreUserData.id == null) {
			firestoreManager.logMeIn(playerName);
		}
		return true;
	}
};