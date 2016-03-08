
var address = null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (request !== {}) {
  		address = request;
  		chrome.browserAction.setIcon({path: "red.png"});
  	} 
});

