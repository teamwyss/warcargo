
var scoreboard = {
		
	score: 0,
	bacon: 0,
	scoreText: null,
	bg: null,
	oTextStyle: { fontSize: '32px', fill: '#FFF', fontWeight: 20 },
	init: function(game) {
		var iPosX = 16;
		var iPosY = 16;
		var iLineH = 40;
		var sColor = "#FFF"

			
		// DO not delete, may be useful var msgBox = game.add.group();
        //make the back of the message box
        this.bg = game.add.sprite(0, 0, "bgScoreboard");
        this.bg.alpha = 0.5;
        this.bg.fixedToCamera = true;
			
		// Score
		this.scoreText = game.add.text(iPosX, iPosY, 'score: 0', this.oTextStyle);
		this.scoreText.fixedToCamera = true;
		
		// Bacon
		iPosY += iLineH;
		this.baconText = game.add.text(iPosX, iPosY, 'bacon: 0', this.oTextStyle);
		this.baconText.fixedToCamera = true;

	},
	addBacon: function() {
		this.bacon++;
		this.baconText.setText("bacon: " + this.bacon);
	},
	updateScore: function(iScore) {
		if (typeof iScore == "undefined") {
			iScore = 100;
		}
		this.score += iScore;
		this.scoreText.setText("score: " + this.score);
	}
}

