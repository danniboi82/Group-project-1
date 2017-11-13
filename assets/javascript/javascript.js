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

})

// METHODS
// ==========================================================

// on.("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks).
    event.preventDefault();
  
    // Initially sets the articleCounter to 0
    articleCounter = 0;
  
    // Empties the region associated with the articles
    $("#well-section").empty();
  
    // Grabbing text the user typed into the search input
    searchTerm = $("#search-term").val().trim();
    var searchURL = queryURLBase + searchTerm;
  
    // Number of results the user would like displayed
    numResults = $("#num-records-select").val();
  
    // Start Year
    startYear = $("#start-year").val().trim();
  
    // End Year
    endYear = $("#end-year").val().trim();
  
    // If the user provides a startYear -- the startYear will be included in the queryURL
    if (parseInt(startYear)) {
      searchURL = searchURL + "&begin_date=" + startYear + "0101";
    }
  
    // If the user provides a startYear -- the endYear will be included in the queryURL
    if (parseInt(endYear)) {
      searchURL = searchURL + "&end_date=" + endYear + "0101";
    }
  
    // Then we will pass the final searchURL and the number of results to
    // include to the runQuery function
    runQuery(numResults, searchURL);
  });
  
  // This button clears the top articles section
  $("#clear-all").on("click", function() {
    articleCounter = 0;
    $("#well-section").empty();
  });
  