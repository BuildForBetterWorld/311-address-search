// $(document).ready(function(){
//   var div = document.getElementById("top_bar");
//   alert(div.innerHTML);
// });
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		file: 'content.js'
	});
});
