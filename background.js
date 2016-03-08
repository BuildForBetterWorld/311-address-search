
// storage for access by popup
var tabInfo = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// store request information in global extension storage
  	var tabId = "id" + sender.tab.id;
  	tabInfo[tabId] = request;

  	// change icon of associated tab 
  	if (request) {
		chrome.browserAction.setIcon({path: "icon16-red.png",
			tabId: sender.tab.id
		});
	}
});

