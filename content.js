
var url = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=%27350%207%20Avenue%27";

function reqListener() {
	console.log(this.responseText);
}

var req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", url);
req.send();