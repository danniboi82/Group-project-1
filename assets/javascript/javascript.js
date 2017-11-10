//API KEY FOR MEETUP : 2c1417672b6d787310406c51316d528
//API KEY FOR iEVENT : mfrnWNrHSVck5Cqk
//API KEY FOR SeatGeek : https://api.seatgeek.com/2/events?client_id=OTU3MDMwMHwxNTEwMjUwNDQ0LjI3#events/0



//DOCUMENT READY, get geo code of user to hydrate page with current events around them. POPULATE using initial AJAX pull using user's current location. 
//USE geo coordinates to get city and city to use in ACUTAL AJAX QUERY.  
//normal page will contain search bar and list of current events below it 
//dislay 6 events (imgs to div)


//Need to figure out how to use api to create list of current events ACCORDING TO USERS CURRENT LOCATION 

//"newpage" aka searched page will contain list of results made according to users input values subject,date,location.
//We will append necessary data to provided/created divs to display results to end user. 

$("#submit").on("click", function() {
$.ajax({
    var userInput = 
    url:"https://api.meetup.com/2/events?key=2c1417672b6d787310406c51316d528&group_urlname=ny-tech&sign=true#meta",
    method: GET,
}) .done(function(){

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
  