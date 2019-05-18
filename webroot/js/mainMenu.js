
var mainMenu ={
	ui: null
	,uiBgScreen: null
	,init: function() {
		this.ui = document.querySelector("#mainMenu-frame");
		this.uiBgScreen = document.querySelector("#mainMenu-bgScreen");
		return this;
	}
	,showOrHide: function(isShow) {
		var sDisplay = isShow ? "block" :  "none"
		this.ui.style.display = sDisplay;
		this.uiBgScreen.style.display = sDisplay;
		return this;
	}
	,show: function() {
		this.showOrHide(true);
		return this;
	}
	,hide: function() {
		this.showOrHide(false);
		return this;
	}
}