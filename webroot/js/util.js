
var util = {
	graphics: {
		percentToColor: function(iPc) {
			var iR = (100 - iPc) * 2.55;
			iR = util.maths.minMax(iR, 0, 255);
			var iG = (iPc * 2.0) + 30;
			iG = util.maths.minMax(iG, 0, 255);
			var iB = iPc * 2.0;
			iB = util.maths.minMax(iB, 0, 255);
			return "rgb(" + iR + "," + iG + "," + iB + ")"; 
		}
	}
	,maths: {
		minMax: function(iRaw, iMin, iMax) {
			return Math.max(Math.min(iRaw, iMax), iMin);
		}
	}
};

function xy(iX, iY) {
	return {x: iX, y: iY};
}