window.onload = popupLogic
var textAddress = null

function popupLogic() {

	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
		var activeTabId = "id" + tabs[0].id;
		var addresses = chrome.extension.getBackgroundPage().tabInfo[activeTabId];
		
		addresses.reverse();
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
  		$('#headline').append('<h1> Historical 311 Complaints from ' + textAddress + '</h1>')
	});
}

