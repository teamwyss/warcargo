
var scoreboard = {
		
	score: 0,
	bacon: 0,
	scoreText: null,
	bg: null,
	oMetrics: {
		iMargin: 20,
		iPosX: 45,
		iPosY: 16,
		iLineH: 40
	},
	oTextStyle: {
		fontSize: '32px',
		fill: '#FFF',
		fontWeight: 20
	},
	init: function(game) {

			
		// DO not delete, may be useful var msgBox = game.add.group();
        //make the back of the message box
        this.bg = game.add.sprite(this.oMetrics.iMargin, this.oMetrics.iMargin, "bgScoreboard");
        this.bg.alpha = 0.5;
        this.bg.fixedToCamera = true;
			
		// Score
        this.oMetrics.iPosY = this.oMetrics.iMargin + Math.round(this.oMetrics.iLineH / 2);
		this.scoreText = game.add.text(this.oMetrics.iPosX, this.oMetrics.iPosY, 'score: 0', this.oTextStyle);
		this.scoreText.fixedToCamera = true;
		
		// Bacon
		this.oMetrics.iPosY += this.oMetrics.iLineH;
		this.baconText = game.add.text(this.oMetrics.iPosX, this.oMetrics.iPosY, 'bacon: 0', this.oTextStyle);
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

