var rentalSiteDict = {
  streeteasy: {
    addressDomTag: 'h1',
    regex: /\s(\S.*)\s#/
  },
  zillow: {
    addressDomTag: 'title',
    regex: /\s*(\S.*?)\s*(#|APT|,|-)/
  },
  zumper: {
    addressDomTag: '.address',
    regex: /\s*(\S.*?)(\s#|,)/
  },
  trulia: {
    addressDomTag: 'span[itemprop=streetAddress]',
    regex: /(.*?)(\s#|$)/
  },
  craigslist: {
    addressDomTag: '.mapaddress',
    regex: /\s*(\S.*)\s(#|APT)/
  },
  padmapper: {
    addressDomTag: '.listing-address',
    regex: /\s*(\S.*?),/
  }
}

setTimeout(function () {
  var site = document.URL
  var regex = /(trulia|streeteasy|zumper|zillow|craigslist|padmapper)/
  var siteRoot = regex.exec(site)[0]
  var siteObject = rentalSiteDict[siteRoot]
  var url = cleanAddress(siteObject)
  createTagObserver(siteObject)
  sendUrlMessage(url)
}, 3000)

function sendUrlMessage (url) {
  $.ajax({
    url: url,
    crossDomain: true,
    success: function (res) {
      chrome.runtime.sendMessage(res)
    },
    error: function (res) {
      chrome.runtime.sendMessage(res)
    }
  })
}

function createTagObserver(site) {
	var target = $(site.addressDomTag).get(0)
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var url = cleanAddress(site)
			sendUrlMessage(url)
		})
	})
	var config = { attributes: true, childList: true, characterData: true, subtree: true }
	observer.observe(target, config)
}

function cleanAddress (site) {
  // obtain raw address 
  var rawAddress = $(site.addressDomTag).text()

  // This section splits any address into an array
  var regexNoApt = site.regex
  var addressNoApt = regexNoApt.exec(rawAddress)[1]
  var addressArray = addressNoApt.split(' ')

  // This section fixes the number
  var ordinalDict = {'w': 'west', 'w.': 'west', 'e': 'east', 'e.': 'east', 'n': 'north', 'n.': 'north', 's': 'south', 's.': 'south'}
  // Known issue with streets using "St" for "Saint"
  var streetDict = {'st': 'street', 'st.': 'street', 'ave': 'avenue', 'ave.': 'avenue', 'rd.': 'road', 'rd': 'road', 'blvd': 'boulevard', 'blvd.': 'boulevard', 'pkwy': 'parkway', 'pkwy.': 'parkway'}
  var regexRemoveNd = /(\d+)(st|nd|rd|th)/


  var cleanAddressArray = []
  addressArray.map(function(elem) {
  	cleanAddressArray.push(isAbbreviatedStreet(isNumberedStreet(isDirection(elem))))
  })

  // returns the urlArray to put into the API request
  var urlBase = cleanAddressArray.join('%20')
  var url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=incident_address,complaint_type,descriptor,resolution_description,created_date,closed_date,incident_zip&incident_address=%27' + urlBase + '%27'
  return url

  // utility functions
  function isDirection (item) {
    return (item.toLowerCase() in ordinalDict) ? ordinalDict[item.toLowerCase()] : item
  }

  function isNumberedStreet (item) {
    return (regexRemoveNd.exec(item)) ? regexRemoveNd.exec(item)[1] : item
  }

  function isAbbreviatedStreet (item) {
    return (item.toLowerCase() in streetDict) ? streetDict[item.toLowerCase()] : item
  }
}

