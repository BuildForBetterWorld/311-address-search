
// // make XMLHttpRequest  
// function reqListener() {
// 	console.log(this.responseText);
// }

// var req = new XMLHttpRequest();
// req.addEventListener("load", reqListener);
// req.open("GET", url);
// req.send();

// format address here
// var rawAddress = '444 7th Avenue #88'

function cleanAddress(rawAddress) {
	//This section splits any address into an array
	var regexNoApt = /\s(\S.*)\s#/
	var addressNoApt = regexNoApt.exec(rawAddress)[1]
	var addressArray = addressNoApt.split(" ")

	//This section fixes the number
	var regexRemoveNd = /(\d+)(st|nd|rd|th)/
	var addressRemoveNd = regexRemoveNd.exec(addressArray[1])
	var cleanAddressArray = []

	if (addressRemoveNd) {
		cleanAddressArray = [addressArray[0], addressRemoveNd[1], addressArray[2]]
	}
	else {
		cleanAddressArray = addressArray
	}

	//returns the urlArray to put into the API request
	var urlBase = cleanAddressArray.join("%20");
	var url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=incident_address,complaint_type,descriptor,resolution_description,created_date,closed_date,incident_zip&incident_address=%27'+urlBase+'%27';
	return url;
	// console.log(urlArray)
}

// make request
// var url = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=incident_address,complaint_type,descriptor,resolution_description,created_date,closed_date,incident_zip&incident_address=%27455%20Broadway%27";

setTimeout(function () {
	// identify website and grab building address
	var rawAddress = document.getElementsByTagName('h1')[0].textContent;
	console.log(rawAddress);
	var url = cleanAddress(rawAddress);
	console.log(url);

	var response = {};
	$.ajax({
		url: url,
		crossDomain: true,
		success: function(res) {
			console.log(res);
			chrome.runtime.sendMessage(res);
		},
		error: function(res) {
			console.log(res);
			chrome.runtime.sendMessage(res);
		}
	});
}, 2000);




