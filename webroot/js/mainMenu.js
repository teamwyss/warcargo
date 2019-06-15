var mainMenu ={
	ui: null
	,uiBgScreen: null
	,uiExplosion: null
	,uiHeading: null
	,uiText: null
	,uiIcon: null
	,uiPlayButton: null

	,message: {
		heading: "WELCOME TO WAR_CARGO"
		,text: "press play to start!"
		,icon: "logoWarCargoBig.png"
	}
	,setPlayButtonText: function(sText) {
		this.uiPlayButton.innerHTML = sText;
	}
	,setMessage: function(sHeading, sText, sIcon) {
		if (typeof sHeading != "undefined") {
			this.message.heading = sHeading;
			this.message.text = sText;
			this.message.icon = sIcon;
		}
		this.uiHeading.innerHTML = this.message.heading;
		this.uiText.innerHTML = this.message.text;
		this.uiIcon.innerHTML = this.message.icon;
	}
	,init: function() {
		this.ui = document.querySelector("#mainMenu-frame");
		this.uiBgScreen = document.querySelector("#mainMenu-bgScreen");
		this.uiExplosion = document.querySelector("#appHeadingExplosion");
		this.uiHeading = this.ui.querySelector("#message #heading");
		this.uiText = this.ui.querySelector("#message #text");
		this.uiIcon = this.ui.querySelector("#message #icon");
		this.uiPlayButton = this.ui.querySelector(".playButton");
		this.setMessage();
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