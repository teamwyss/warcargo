
var util = {
	el: function(sTrg, sHtm) {
		var elTrg = document.querySelector(sTrg);
		if (this.isDefined(sHtm)) {
			elTrg.innerHTML = sHtm;
		}
		return elTrg;
	}
	, isDefined: function(vValue) {
		return (typeof vValue != "undefined");
	}
	,getSafe: function(vIn, vDefault) {
		if (typeof vIn === typeof vDefault) {
			// It is an absolute match. All good.
			return vIn;
		}
		if (!this.isDefined(vIn)) {
			return vDefault;
		}
		if (typeof vDefault == "number") {
			if (isNaN(parseInt(vIn))) {
				return vDefault;
			}
			return parseInt(vIn);
		}
		return null;
	}
	,extend: function(oSuper, oSubName, oSub) {
		if (typeof oSuper != "object") {
			console.error("a util lib attempted to load without a parent lib");
		} else {
			oSuper[oSubName] = {};
			for (var key in oSub) {
				if (oSub.hasOwnProperty(key)) {
					oSuper[oSubName][key] = oSub[key];
				}
			}
		}
		oSub["superUtil"] = oSuper;
	}
}
