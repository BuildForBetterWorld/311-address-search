window.onload = popupLogic;

function popupLogic() {
	var address = chrome.extension.getBackgroundPage().address;
	address.map(function(obj) {
		// date cleaning
		if (obj.closed_date) {
			obj.closed_date = new Date(obj.closed_date)
				.toDateString().substring(4);
		}

		obj.created_date = new Date(obj.created_date)
			.toDateString().substring(4);

		$("#complaint-list").append('<li>' + obj.created_date + '\n' + obj.closed_date +
					'\n' + obj.resolution_description + '\n' + obj.descriptor + '</li>');
	});


}