
var scoreboard = {
		
	points: null,
	level: null,
	bacon: null,
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
		
		this.bacon = this.createNewSlot().init("#inventory-frame div#bacon", "bacon");
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
					this.count = this.max;
				}
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
			uiFrame:null,
			uiFuel:null,
			init: function(xpath) {
				this.uiFrame = document.querySelector(xpath);
				this.uiFuel = document.querySelector(xpath + " .fuel");
				return this;
			},
			refresh: function(xpath) {
				var iPc = Math.round((scoreboard.points.count * 100) / scoreboard.points.max);
				var iPx = 2 * iPc; 
				//this.uiFrame.innerHTML = iPx + "px == " + iPc + "%";
				this.uiFuel.style.width = iPx + "px";
			}
		}
	},
	createNewSlot: function() {
		return {
			id:null,
			count:0,
			ui:null, 
			digit:null,
			icon:null,
			init: function(xpath, name){
				this.ui = document.querySelector(xpath);
				this.id = name
				this.digit = this.ui.querySelector(".digit");
				this.icon = this.ui.querySelector(".icon");
				this.icon.style.backgroundImage = "url('../img/" + this.id + ".png')";
				this.icon.style.opacity = "0.3";
				
				return this;
			},
			add: function(iChange){
				this.count += (typeof iChange == "undefined") ? 1 : iChange;
				//d ebugger;
				if (this.count > 0) {
					this.icon.style.opacity = "1.0";
				}
				this.digit.innerHTML = this.count;
				return this;
			}
		}
	}
}