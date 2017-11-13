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
var userQuery = "&q="+userSearch;
var baseQueryURL = "https://api.seatgeek.com/2/events?" + apiKey + userQuery;


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
  //add userDate 
  userDate = $("#userDate").val().trim();
  //create variable queryDate to hold date queried with URL parameters ex. (2017-12-25)
  var queryDate = "&datetime_utc=" + userDate;
  //create searchURL to pass in as queryURL in AJAX call
  searchURL = searchURL + queryDate;
  console.log(searchURL);
  //add userCity 
  userCity = $("#userCity").val().trim();
  //create variable queryCity to hold city queried with URL parameters
  var queryCity = "&venue.city=" + userCity;
  //create searchURL to pass in as queryURL in AJAX call
  searchURL = searchURL + queryCity;
  console.log(searchURL);
  //add userState 
  userState = $("#userState").val().trim();
  //create variable queryState to hold state queried with URL parameters
  var queryState = "&venue.state=" + userState;
  //create searchURL to pass in as queryURL in AJAX call
  searchURL = searchURL + queryState;
  console.log(searchURL);
  runSearch(searchURL);
});

