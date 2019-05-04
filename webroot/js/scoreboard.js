
var scoreboard = {
		
	points: null,
	level: null,
	bacon: null,
	guage: null,

	init: function(game) {
		
		this.ui = document.querySelector("scoreboard-frame");

		this.points = this.createNewStat().init("#points-digit");
		this.points.overflow = function(){
			scoreboard.points.reset();
			scoreboard.level.add();
		}
		this.points.afterAdd = function(){
			scoreboard.pointsGuage.refresh();
		}
		this.level = this.createNewStat().init("#level-digit");
		this.bacon = this.createNewSlot().init("#inventory-frame div#bacon", "bacon.png");
		this.pointsGuage = this.createNewGuage().init("#points-guage");
	},
	createNewStat: function() {
		return {
			count:0,
			max:300,
			ui:null, 
			init: function(xpath){
				this.ui = document.querySelector(xpath);
				this.ui.innerHTML = this.count;
				return this;
			},
			add: function(iChange){
				this.count += (typeof iChange == "undefined") ? 1 : iChange;
				if (this.count >= this.max) {
					this.overflow();
				}
				this.ui.innerHTML = this.count;
				this.afterAdd();
				return this;
			},
			reset: function(){
				this.count = 0;
				this.add(0);
			},
			overflow: function(){},
			afterAdd: function(){}
		}
	},
	createNewGuage: function() {
		return {
			init: function(xpath) {
				this.ui = document.querySelector("#fuel");
				return this;
			},
			refresh: function(xpath) {
				this.ui.innerHTML = Math.round((scoreboard.points.count * 100) / scoreboard.points.max) + "%";
			}
		}
	},
	createNewSlot: function() {
		return {
			count:0,
			ui:null, 
			digit:null,
			imgName:null,
			init: function(xpath, imgName){
				this.ui = document.querySelector(xpath);
				this.imgName = imgName
				this.digit = this.ui.querySelector(".digit");
				return this;
			},
			add: function(iChange){
				this.count += (typeof iChange == "undefined") ? 1 : iChange;
				if (this.count == 0) {
					this.ui.style.backgroundImage = "url('../img/" + this.imgName + "')";
				}
				this.digit.innerHTML = this.count;
				return this;
			}
		}
	}
}