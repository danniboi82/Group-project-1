//API KEY FOR MEETUP : 2c1417672b6d787310406c51316d528
//API KEY FOR iEVENT : mfrnWNrHSVck5Cqk
//API KEY FOR SeatGeek : https://api.seatgeek.com/2/events?client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3#events/0

$(document).ready(function () {

    //  Object to keep default images if IPA does not provide them
    var Image = {
        band: "assest/images/band.jpg",
        concert: "assest/images/concert.jpg",
        sports: "assest/images/sport.jpg",
        theater_broadway_national_tours: "assest/images/theater.jpg",
        auto_racing: "assest/images/auto_racing.jpg",
        theater: "assest/images/theater_2.jpg",
        default: "assest/images/default.jpg"
    };

    console.log(Image.band);


    // get  current position from browser, return Latitude and Longitude
    var browserLatitude, browserLongitude;

    (function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                browserLatitude = position.coords.latitude;
                browserLongitude = position.coords.longitude;
                console.log(browserLatitude);
                console.log(browserLongitude);
                testingAjaxRequest(browserLatitude, browserLongitude);
            });
        } else {
            // for testing
            console.log("Geolocation is not supported by this browser.");
        }
    })();

    // function takes 1 event (response.events[i]) from seatgeek ajax response
    function getPic(seatgeekEvent) {
        var pic = [];
        // if few performers for the event --> make an array of pics.
        for (var i = 0; i < seatgeekEvent.performers.length; i++) {
            var image = seatgeekEvent.performers[i].image;
            if (image != null) {
                pic.push(image)
            }
        }
        // if no images were founded in API response -> return a default image
        if (!pic.length) {
            var eventType = seatgeekEvent.type;
            pic.push(Image[eventType] || Image.default);
        }
        // return an array of pic in case the event has a few performers and every perfermer has its own pic.
        return pic;


    }

    // -------------------------------------------------------------------------
    // TEST CALL AJAX REQUEST TO SEATGEEK API

    function testingAjaxRequest(lat, lon) {
        var apiKey = "client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3";
        var baseQueryURL = "https://api.seatgeek.com/2/events?" + apiKey + "&lat=" + lat + "&lon=" + lon;
        console.log(baseQueryURL);

        $.ajax({
            url: baseQueryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            displayMap(response.events);
        });
    };

    // END OF TEST FOR AJAX REQUEST
    // -------------------------------------------------------------------------

    // insert a new map into <div> with id="map"
    var map = L.map('map');
    // add tile Layer 
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // takes array of events (response.events) from seatgeek ajax response
    function displayMap(seatgeekEvents) {
        var markerLayer = L.featureGroup().addTo(map);
        for (var i = 0; i < seatgeekEvents.length; i++) {
            var loc = seatgeekEvents[i].venue.location;
            L.marker(loc).addTo(markerLayer)
                .bindPopup(seatgeekEvents[i].title);
        }
        map.fitBounds(markerLayer.getBounds());
    }
});


//API KEY FOR SeatGeek : client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3
//Host URL : https://api.seatgeek.com/2/events?
// These variables will hold the results we get from the user's inputs via HTML
var userSearch = "";
var userDate = 0;
var userCity = "";
var userState = "";

//DOCUMENT READY, get geo code of user to hydrate page with current events around them. POPULATE using initial AJAX pull using user's current location. 
//USE geo coordinates to get city and city to use in ACUTAL AJAX QUERY.  
//normal page will contain search bar and list of current events below it 
//dislay 6 events (imgs to div)


//Need to figure out how to use api to create list of current events ACCORDING TO USERS CURRENT LOCATION 

//"newpage" aka searched page will contain list of results made according to users input values subject,date,location.

//Append necessary data to provided/created divs to display results to end user. 

var apiKey = "&client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3"
// var userQuery = "&q="+userSearch;
var baseQueryURL = "https://api.seatgeek.com/2/events?" + apiKey;


console.log(baseQueryURL);

function runSearch(queryURL) {
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).done(function (response) {

    //clear search from before
    $("#searchResults").empty();

    for(var i = 0 ; i < response.events.length; i++){
      console.log(response.events[i].title);
      console.log(response.events[i].url);
      console.log(response.events[i].venue.display_location);
      console.log(response.events[i].datetime_local);
      console.log(response.events[i].performers[0].image);
      //Link JSON returns to HTML
      //create div to diplay results data
      var displayResults = $("<div>");
      //create cardClass(bootstrap) to contain data and image
      displayResults.addClass("card");
      //create id for each returned object
      displayResults.attr("id", "returnedData" + i);
      //append diplay results to id searchResults
      $("#searchResults").append(displayResults);
      //***if image object is null use stock image in place.***
      // if(response.event[i].performers[0].image === null){}
      //append results to each card.
      $("#returnedData" + i).append("<img src=" + response.events[i].performers[0].image + ">");       
      $("#returnedData" + i).append("<h3>" + response.events[i].title +"<h3>"); 
      $("#returnedData" + i).append("<p>Event Location :" + response.events[i].venue.display_location +"<p>"); 
      $("#returnedData" + i).append("<p>Event Date/Time :" + response.events[i].datetime_local +"<p>"); 
      $("#returnedData" + i).append("<a href=" + response.events[i].url + ">" + response.events[i].url + "</a>");       
    }
  });
}

// on.("click") event store user inputs and perform search via runSearch
$("#submitSearch").on("click", function (event) {
  //prevents default event from occuring
  event.preventDefault();
  // ATTEMPTING TO EMPTY searchResults div to append json object (data) NOT WORKING
  $("#searchResuts").remove();

  // Grabbing text the user typed into the search input
  userSearch = $("#userSearch").val().trim();
  //confirm userSearch 
  console.log(userSearch);
  //create var userQuery hold user search with URL parameters
  var userQuery = "&q=" + userSearch;
  //create searchURL (URL to be searched ) to pass in as queryURL in AJAX call
  var searchURL = baseQueryURL + userQuery;
  //confirm searchURL 
  console.log(searchURL);

  //*********************ATTEMPTED TO MAKE but not WORKING as intended *************************************************
  // //add userDate 
  // userDate = $("#userDate").val().trim();
  // //create variable queryDate to hold date queried with URL parameters ex. (2017-12-25)
  // var queryDate = "&datetime_utc=" + userDate;
  // //create searchURL to pass in as queryURL in AJAX call
  // searchURL = searchURL + queryDate;
  // console.log(searchURL);
  // //add userCity 
  // userCity = $("#userCity").val().trim();
  // //create variable queryCity to hold city queried with URL parameters
  // var queryCity = "&venue.city=" + userCity;
  // //create searchURL to pass in as queryURL in AJAX call
  // searchURL = searchURL + queryCity;
  // console.log(searchURL);
  // //add userState 
  // userState = $("#userState").val().trim();
  // //create variable queryState to hold state queried with URL parameters
  // var queryState = "&venue.state=" + userState;
  // //create searchURL to pass in as queryURL in AJAX call
  // searchURL = searchURL + queryState;
  // console.log(searchURL);
  runSearch(searchURL);
});

