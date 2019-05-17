
var mainMenu ={
	ui: null
	,init: function() {
		this.ui = document.querySelector("#mainMenu-frame");
		return this;
	}
	,show: function() {
		return this;
	}
	,hide: function() {
		this.ui.style.display = "none";
		return this;
	}
}