
// Find address
var rentalSiteDict = {
  streeteasy: {
    rawAddress: function () {return document.getElementsByTagName('h1')[0].textContent },
    regex: /\s(\S.*)\s#/
  },
  zillow: {
    rawAddress: function () { return document.getElementsByTagName('title')[0].textContent },
    regex: /\s*(\S.*)\s(#|APT)/
  },
  zumper: {
    rawAddress: function () { return document.getElementsByTagName('h2')[0].textContent },
    regex: /\s*(\S.*)\s#/
  },
  craigslist: {},
  trulia: {
    rawAddress: function () {return document.getElementsByClassName('h2 headingDoubleSuper')[0].textContent},
    regex: ''
  }
}

setTimeout(find311Data, 1000)

function cleanAddress (site) {
  // obtain raw address 
  var rawAddress = site.rawAddress()
  console.log(rawAddress)

  // This section splits any address into an array
  var regexNoApt = site.regex
  console.log(regexNoApt)
  var addressNoApt = regexNoApt.exec(rawAddress)[1]
  var addressArray = addressNoApt.split(' ')

  // This section fixes the number

  var ordinalDict = {'w': 'west', 'w.': 'west', 'e': 'east', 'e.': 'east', 'n': 'north', 'n.': 'north', 's': 'south', 's.': 'south'}
  // Known issue with streets using "St" for "Saint"
  var streetDict = {'st': 'street', 'st.': 'street', 'ave': 'avenue', 'ave.': 'avenue', 'rd.': 'road', 'rd': 'road', 'blvd': 'boulevard', 'blvd.': 'boulevard', 'pkwy': 'parkway', 'pkwy.': 'parkway'}
  var regexRemoveNd = /(\d+)(st|nd|rd|th)/
  var cleanAddressArray = []

  function isDirection (item) {
    if (item.toLowerCase() in ordinalDict) {
      return ordinalDict[item.toLowerCase()]
    } else {
      return item
    }
  }

  function isNumberedStreet (item) {
    if (regexRemoveNd.exec(item)) {
      return regexRemoveNd.exec(item)[1]
    } else {
      return item
    }
  }

  function isAbbreviatedStreet (item) {
    if (item.toLowerCase() in streetDict) {
      return streetDict[item.toLowerCase()]
    } else {
      return item
    }
  }

  for (i = 0; i < addressArray.length; i++) {
    cleanAddressArray[i] = isAbbreviatedStreet(isNumberedStreet(isDirection(addressArray[i])))
  }
  console.log(cleanAddressArray)

  // returns the urlArray to put into the API request
  var urlBase = cleanAddressArray.join('%20')
  var url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=incident_address,complaint_type,descriptor,resolution_description,created_date,closed_date,incident_zip&incident_address=%27' + urlBase + '%27'
  return url
}

function find311Data () {
  // identify website and compute api url
  var site = document.URL

  if (site.includes('trulia')) {
    var url = cleanAddress(rentalSiteDict.trulia)
  } else if (site.includes('streeteasy')) {
    var url = cleanAddress(rentalSiteDict.streeteasy)
  } else if (site.includes('zumper')) {
    var url = cleanAddress(rentalSiteDict.zumper)
  } else if (site.includes('zillow')) {
    var url = cleanAddress(rentalSiteDict.zillow)
  } else {
    var url = ''
  }

  $.ajax({
    url: url,
    crossDomain: true,
    success: function (res) {
      chrome.runtime.sendMessage(res)
    // console.log("sent res: ", res)
    },
    error: function (res) {
      chrome.runtime.sendMessage(res)
    // console.log("sent err: ", res)
    }
  })
}

// event listener for title change







