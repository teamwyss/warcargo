
var utilCookie = {
	"get": function(sName) {
		sName = sName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(sName) == 0){
				return c.substring(sName.length, c.length);
			}
		}
		return "";
	}
	,"getInt": function(sName) {
		var sOut = this.get(sName);
		if (sOut == "") {
			return null;
		} else if (isNaN(sOut)) {
			return null;
		} else {
			return parseInt(sOut);
		}
	}
	,"set": function(sName, sValue, iExpDays) {
		var expires = "";
		if (typeof iExpDays != "undefined") {
			var dtExp = new Date();
			dtExp.setTime(dtExp.getTime() + (iExpDays*24*60*60*1000));
			expires = "; expires=" + dtExp.toUTCString();
		}
		document.cookie = sName + "=" + sValue + expires;
	}
	,"delete": function(sName) {
		this.set(sName, "", 0);
	}
}

try { util.extend(util, "cookie", utilCookie); } catch (e) {}
