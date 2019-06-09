
var utilCookieObject = {
	getObject: function(sName, oDefault) {
		var s = util.cookie.get(sName);
		if (s.length == 0) {
			if (typeof oDefault == "undefined") {
				return null;
			}
			return oDefault;
		}
		console.log("got object s " + s);
		var s2 = unescape(s);
		console.log("got object s2 " + s2);
		var o = {};
		try {
			o = JSON.parse(unescape(s));
		} catch (e) {
			console.error("s " + s2);
			console.error("util.cookie.object.getObject failed.");
		}
		return o;
	}
	,setObject: function(sName, o) {
		var s = escape(JSON.stringify(o));
		console.log("about to set value " + s)
		util.cookie.set(sName, s);
	}
}

try { util.extend(util.cookie, "object", utilCookieObject); } catch (e) {}
