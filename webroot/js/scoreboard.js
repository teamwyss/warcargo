
var scoreboard = {
		
	points: null,
	level: null,
	health: null,
	bacon: null,
	wood: null,
	guage: null,

	
	init: function(game) {
		
		this.ui = document.querySelector("scoreboard-frame");

		this.points = this.createNewStat().init("#points-digit");
		this.points.afterAdd = function(){
			scoreboard.pointsGuage.refresh();
			if (scoreboard.points.count >= scoreboard.points.max) {
				scoreboard.points.reset();
				scoreboard.level.add();
				setTimeout(
					function(){
						scoreboard.pointsGuage.refresh();
					}
					,600
				);
			}
		}
		
		this.level = this.createNewStat().init("#level-digit");
		this.level.afterAdd = function(){
			scoreboard.level.ui.style.backgroundColor = "white";
			setTimeout(
				function(){
					scoreboard.level.ui.style.backgroundColor = "transparent";
				}
				,200
			);
		}
		
		this.health = this.createNewStat().init("#health-digit");
		this.health.add(100);
		this.health.max = 100;
		this.healthGuage = this.createNewGuage().init("health", "#health-guage");//.refresh();
		this.health.afterAdd = function(){
			scoreboard.healthGuage.refresh();
			if (scoreboard.health.count <= 0) {
				mainMenu.setMessage(
					"u ded"
					,"you died sucker!"
					,"dead.png"
				);
				mainMenu.setPlayButtonText("PLAY AGAIN");
				mainMenu.show();
				scoreboard.resetAllScores();
			}
		}
		this.healthGuage.refresh();
		this.healthGuage.afterRefresh = function(){
			// Change color depending on health.
			var sColor = util.maths.graphics.percentToColor(scoreboard.health.count);
			scoreboard.healthGuage.uiFuel.style.backgroundColor = sColor;
		};
		
		var aoSlots = [
			{
				id: "bacon",
				iconFile: "food.bacon.svg"
			},
			{
				id: "wood",
				iconFile: "food.wood.svg"
			}
		];
		var uiSlotParent = document.querySelector("#inventory-frame");
		for (var iS = 0; iS < aoSlots.length; iS++) {
			var oSlotTemp = aoSlots[iS];
			this[oSlotTemp.id] = this.createNewSlot().init(uiSlotParent, oSlotTemp);
		}
		this.pointsGuage = this.createNewGuage().init("points", "#points-guage");
		
	},
	createNewSlot: function() {
		return {
			id:null,
			max:1000,
			count:0,
			ui:null, 
			digit:null,
			icon:null,
			init: function(uiSlotParent, oSettings){
				this.id = oSettings.id;
				var uiOuter = util.ui.createElement(
					uiSlotParent,
					"div",
					{"id": this.id, "class": "slot"}
				);
				this.icon = util.ui.createElement(
					uiOuter,
					"div",
					{"class": "icon"}
				);
				this.digit = util.ui.createElement(
					uiOuter,
					"div",
					{"class": "digit"}
				);
				this.icon.style.backgroundImage = "url('../img/" + oSettings.iconFile + "')";
				this.icon.style.opacity = "0.3";
				return this;
			},
			add: function(iChange){
				this.count += (typeof iChange == "undefined") ? 1 : iChange;
				this.count = util.maths.minMax(this.count, 0, this.max);
				if (this.count > 0) {
					this.icon.style.opacity = "1.0";
				}
				this.digit.innerHTML = this.count;
				return this;
			}
		}
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
				//if (this.count >= this.max) {
				//	this.count = this.max;
				//}
				this.count = util.maths.minMax(this.count, 0, this.max);
				this.ui.innerHTML = this.count;
				this.afterAdd();
				return this;
			},
			reset: function(){
				this.count = 0;
				this.add(0);
			},
			afterAdd: function(){}
		}
	},
	createNewGuage: function() {
		return {
			stat:null,
			uiFrame:null,
			uiFuel:null,
			init: function(sStatId, xpath) {
				this.stat = scoreboard[sStatId];
				this.uiFrame = document.querySelector(xpath);
				this.uiFuel = document.querySelector(xpath + " .fuel");
				return this;
			},
			refresh: function() {
				//var iPc = Math.round((scoreboard.points.count * 100) / scoreboard.points.max);
				//var iPc = Math.round((scoreboard["health"].count * 100) / scoreboard["health"].max);
				var iPc = Math.round((this.stat.count * 100) / this.stat.max);
				var iPx = 2 * iPc; 
				//this.uiFrame.innerHTML = iPx + "px == " + iPc + "%";
				this.uiFuel.style.width = iPx + "px";
				this.afterRefresh();
				return this;
			},
			afterRefresh: function(){}
		}
	},
	resetAllScores: function() {
		this.points.add(-1000);
		this.level.add(-1000);
		this.bacon.add(-1000);
		this.wood.add(-1000);
		this.health.add(100);
	}
	

}