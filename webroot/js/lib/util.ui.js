
var utilUi = {
	/**
	 * Manage the DOM and its ui elements.
	 * (uiParentElement, "div", {class:"className"}, "text inside" | null)
	 */
	createElement: function(uiParent, sElType, oAttributes, sContent) {
		var fragment = document.createDocumentFragment();
		var uiNew = document.createElement(sElType);
		if (typeof sContent != "undefineed" && sContent != null) {
			uiNew.innerHTML = sContent;
		}
		for (sAttr in oAttributes) {
			uiNew.setAttribute(sAttr, oAttributes[sAttr]);
		}
		fragment.appendChild(uiNew);
		uiParent.appendChild(fragment);
		return uiNew;
	}
}

try { util.extend(util, "ui", utilUi); } catch (e) {}
