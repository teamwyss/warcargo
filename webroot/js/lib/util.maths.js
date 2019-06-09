
var utilMaths = {
	minMax: function(iRaw, iMin, iMax) {
		return Math.max(Math.min(iRaw, iMax), iMin);
	}
};

try { util.extend(util, "maths", utilMaths); } catch (e) {}
