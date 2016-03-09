// TO DO
// ~ if addresses is null, we need to just return a "no complaints" message

window.onload = popupLogic
var textAddress = null

function popupLogic() {

	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
		var activeTabId = "id" + tabs[0].id;
		var addresses = chrome.extension.getBackgroundPage().tabInfo[activeTabId];

		console.log(addresses)
		if (addresses.length !== 0) {
			addresses.map(function(obj) {
				// date cleaning
				if (obj.closed_date) {
					obj.closed_date = new Date(obj.closed_date)
						.toDateString().substring(4);
				}

				obj.created_date = new Date(obj.created_date)
					.toDateString().substring(4);

				textAddress = obj.incident_address
 				$('.complaintList').append('<div class="complaintItem"><h2>' + obj.created_date + '</h2> <div class="moreInfo"> <p><span class="category">Incident Description:</span> ' + obj.descriptor + '</p><p><span class="category">Category:</span> ' + obj.complaint_type + '</p><p><span class="category">Close date:</span> ' + obj.closed_date + '</p><p><span class="category">Resolution description:</span> ' + obj.resolution_description + '</p></div></div>')	    	
 		});
	  		$('#disclaimer').append('<p style="padding: 10px">311 complaints are registered against a building, and not a specific apartment. As a result, these incidents could have come from any apartment in this building, and not necessarily this one. For more information, <a target="_blank" href="http://www1.nyc.gov/311/">visit NYC 311</a>.</p>')
    		$('#headline').append('<h1>311 Complaints from ' + textAddress + '</h1>')

	  	} else {
	  		$('.complaintList').append('<span>No results, but the address may be formatted in a way we didn\'t expect</span>');
	  	}
	});
}

