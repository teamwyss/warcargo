

var gameController = {
	startGame: function() {
		mainMenu.hide();
		enemyStatus.chaseSpeed = enemyStatus.chaseSpeedDefault;
	},
	pauseGame: function() {
		this.endGame();
	},
	endGame: function() {
		mainMenu.show();
		enemyStatus.chaseSpeed = 0;
	}
};