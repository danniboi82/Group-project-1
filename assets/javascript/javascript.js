$(document).ready(function () {

    //  Object to keep default images if IPA does not provide them
    var Image = {
        band: "assets/images/band.jpg",
        concert: "assets/images/concert.jpg",
        sports: "assets/images/sport.jpg",
        theater_broadway_national_tours: "assets/images/theater.jpg",
        auto_racing: "assets/images/auto_racing.jpg",
        theater: "assets/images/theater_2.jpg",
        default: "assets/images/default.jpg"
    };

    //  returns today's date as a string in format yyyy-mm-dd
    function dayToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = yyyy + "-" + mm + "-" + dd;
        return today;
    }

    // get  current position from browser, return Latitude and Longitude
    var browserLatitude, browserLongitude;

    (function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                browserLatitude = position.coords.latitude;
                browserLongitude = position.coords.longitude;
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
        // if few performers for  the event --> make an array of pics.
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

        $.ajax({
            url: baseQueryURL,
            method: "GET"
        }).done(function (response) {
            displayMap(response.events);
        });
        runSearch(baseQueryURL);
    };

    // END OF TEST FOR AJAX REQUEST
    // -------------------------------------------------------------------------

    // insert a new map into <div> with id="map"
    var map = L.map('map');
    var markerLayer;
    // add tile Layer 
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // takes array of events (response.events) from seatgeek ajax response
    function displayMap(seatgeekEvents) {
        if (markerLayer) {
            map.removeLayer(markerLayer);

        }
        markerLayer = L.featureGroup().addTo(map);
        for (var i = 0; i < seatgeekEvents.length; i++) {
            var loc = seatgeekEvents[i].venue.location;
            var eventId = "returnedData" + i;
            var eventName = seatgeekEvents[i].title;
            var link = "<a href=#" + eventId + ">" + eventName + "</a>"

            L.marker(loc).addTo(markerLayer)
                .bindPopup(link);
        }
        map.fitBounds(markerLayer.getBounds());
    }


    // These variables will hold the results we get from the user's inputs via HTML
    var userSearch = "";
    var userCity = "";
    var userState = "";

    var apiKey = "&client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3"
    var baseQueryURL = "https://api.seatgeek.com/2/events?" + apiKey;


    function runSearch(queryURL) {
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function (response) {
            displayMap(response.events);

            //clear search from before
            $("#searchResults").empty();

            if (response.events.length === 0) {
                $("#noSearchResults").html("NO RESULTS PLEASE TRY AGAIN");
            } else {
                $("#noSearchResults").remove();
                for (var i = 0; i < response.events.length; i++) {
                    var displayResults = $("<div>");
                    //create cardClass(bootstrap) to contain data and image
                    displayResults.addClass("card");
                    //create id for each returned object
                    displayResults.attr("id", "returnedData" + i);
                    displayResults.attr("class", "row");
                    // create div to collect info about event align right from the pic
                    var eventInfoDiv = $("<div>");
                    eventInfoDiv.addClass("col-sm-9");
                    //append diplay results to id searchResults
                    $("#searchResults").append(displayResults);
                    //append results to each card.
                    displayResults.append("<img class='col-sm-3 resultImage' src=" + getPic(response.events[i])[0] + ">");
                    eventInfoDiv.append("<h3 class=eventInfoDiv-sm-9>" + response.events[i].title);
                    eventInfoDiv.append("<p> <b>Event Location : </b>" + response.events[i].venue.display_location + "<p>");
                    eventInfoDiv.append("<p> <b>Event Date/Time : </b>" + response.events[i].datetime_local + "<p>");
                    eventInfoDiv.append("<a href=" + response.events[i].url + ">" + response.events[i].url + "</a>");
                    displayResults.append(eventInfoDiv);
                }
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
        //create var userQuery hold user search with URL parameters
        var userQuery = "&q=" + userSearch;
        //create searchURL (URL to be searched ) to pass in as queryURL in AJAX call
        var searchURL = baseQueryURL + userQuery;
        //add userCity 
        userCity = $("#userCity").val().trim();
        userCity = userCity.split(' ').join('+');
        weather(userCity);
        if (userState && !userCity) {
            (userCity = userState)
        }
        //create variable queryCity to hold city queried with URL parameters
        var queryCity = "&venue.city=" + userCity;
        //create searchURL to pass in as queryURL in AJAX call
        searchURL = searchURL + queryCity;
        console.log(searchURL);
        //add userState 
        userState = $("#userState").text().trim();
        if (userState) {
            var queryState = "&venue.state=" + userState;
            //create searchURL to pass in as queryURL in AJAX call
            searchURL = searchURL + queryState;
        }

        //if userstate doens't exist and usercity exists then userstate equals user city 
        //create variable queryState to hold state queried with URL parameters
        if (userState) {
            var queryState = "&venue.state=" + userState;
            searchURL = searchURL + queryState;
        }
        runSearch(searchURL);
    });
});

//weather API starts here - Archie
//Tried to connect the "City" section from the form to sync with the city data, userCity
function weather(userCity) {
    if (userCity != '') {
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' + userCity + '&units=imperial' + '&APPID=13c12670457fb8abfe535c34a3edb056',
            type: 'GET'
        }).done(function (response) {
            var widget = show(response);
            console.log(widget);
            $('#weather').html(widget);

        }
            );

    };
};
//function to show data
function show(data) {

    return '<h5 class="text-center">Current Weather: ' + data.name + ',' + data.sys.country + '</h5>' +
        '<p class="small">Weather: ' + data.weather[0].main + '</p>' +
        '<p class="small">Description: ' + data.weather[0].description + '</p>' +
        '<p class="small">Temperature: ' + data.main.temp + '</p>' +
        '<p class="small">Humclassity: ' + data.main.humclassty + '</p>' +
        '<p class="small">Minimum Temperature: ' + data.main.temp_min + '</p>' +
        '<p class="small">Maximum Temperature: ' + data.main.temp_max + '</p>' +
        '<p class="small">Wind Direction: ' + data.wind.degree + '</p>' +
        '<p class="small">Wind Speed: ' + data.wind.speed + '</p>';


};

