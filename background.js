// storage for access by popup
var tabInfo = {}

// listener for request message from content script
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // store request information in global extension storage
    var tabId = 'id' + sender.tab.id

    // sort responses by date
    request.sort(function (a, b) {
      return new Date(a.created_date) - new Date(b.created_date)
    }).reverse()

    tabInfo[tabId] = request

    chrome.browserAction.setPopup({popup: 'popup.html',
      tabId: sender.tab.id
    })

  	// change icon of associated tab 
  	if (request.length > 0) {
		chrome.browserAction.setIcon({path: "icon16-red.png",
			tabId: sender.tab.id
		})
	} else if (request.length === 0) {
		// turn green
		chrome.browserAction.setIcon({path: "icon16-green.png",
			tabId: sender.tab.id
		})
	} 
})

