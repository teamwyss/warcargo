
var mainMenu ={
	ui: null
	,uiBgScreen: null
	,uiExplosion: null
	,init: function() {
		this.ui = document.querySelector("#mainMenu-frame");
		this.uiBgScreen = document.querySelector("#mainMenu-bgScreen");
		this.uiExplosion = document.querySelector("#appHeadingExplosion");
		return this;
	}
	,showOrHide: function(isShow) {
		var sDisplay = isShow ? "block" :  "none"
		this.ui.style.display = sDisplay;
		this.uiBgScreen.style.display = sDisplay;
		if (isShow) {
			setTimeout(
				function(){
					var htmlExplosion = "<img src=\"../img/animExplosion01.gif" + "\"/>";
					mainMenu.uiExplosion.innerHTML = htmlExplosion;
				}
				,500
			);
			setTimeout(
				function(){
					mainMenu.uiExplosion.innerHTML = "";
				}
				,2000
			);
		}
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