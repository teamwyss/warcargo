
socketUiTools.decorateUserRow = function(docId, docData) {
	return "<tr id=\"" + docId + "\" title=\"" + docId + "\" ><td>" + docData.name + "</td>"
		+ "<td>" + docData.score + "</td>"
		+ "<td>" + docData.x + "</td>"
		+ "<td>" + docData.y + "</td>"
		+ "<td>" + docData.rotation + "</td>"
		+ "<td>" + docId + "</td>" 
		+ "<td onclick=\"deleteUser(\'" + docId + "\');\">X</td>" 
		+ "</tr>";
};

socketUiTools.tableHeader = "<tr id=\"header\"><td>name"
	+ "</td><td>score</td>"
	+ "<td>x</td>"
	+ "<td>y</td>"
	+ "<td>rotation</td>"
	+ "<td>id</td>"
	+ "<td>kill</td>"
	+ "</tr>";

var admin = {
}
