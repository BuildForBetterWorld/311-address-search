// TO DO
// ~ match on zip code to make sure we're getting the right borough
// zumper: <h1 class="details-address">
// trulia: <span itemprop="streetAddress"> 
// zillow: <header class="addr"> 


find311Data();

function cleanTruliaAddress() {
	var rawAddress = document.getElementsByClassName('h2 headingDoubleSuper')[0].textContent;

}

function cleanStreetEasyAddress() {
	// obtain raw address 
	var rawAddress = document.getElementsByTagName('h1')[0].textContent;

	//This section splits any address into an array
	var regexNoApt = /\s(\S.*)\s#/
	var addressNoApt = regexNoApt.exec(rawAddress)[1]
	var addressArray = addressNoApt.split(" ")

	//This section fixes the number
	var regexRemoveNd = /(\d+)(st|nd|rd|th)/
	var addressRemoveNd = regexRemoveNd.exec(addressArray[1])
	alert(addressRemoveNd);
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
}

function find311Data() {
	// identify website and compute api url
	var site = document.URL;
	if (site.includes("trulia")) {
		var url = cleanTruliaAddress();
	} else if (site.includes("streeteasy")) {
		var url = cleanStreetEasyAddress();
	} else if (site.includes("zumper")) {
		var url = cleanZumperAddress();
	} else if (site.includes("zillow")) {
		var url = cleanZillowAddress();
	} else {
		var url = '';
	}
	
	var response = {};
	$.ajax({
		url: url,
		crossDomain: true,
		success: function(res) {
			chrome.runtime.sendMessage(res);
			//console.log("sent res: ", res);
		},
		error: function(res) {
			chrome.runtime.sendMessage(res);
			//console.log("sent err: ", res);
		}
	});
}




