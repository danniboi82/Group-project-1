
$(document).ready(function(){

//  Object to keep default images if IPA does not provide them
    var Image = {
        band: "assest/images/band.jpg",
        concert: "assest/images/concert.jpg",
        sports: "assest/images/sport.jpg",
        theater_broadway_national_tours: "assest/images/theater.jpg",
        auto_racing: "assest/images/auto_racing.jpg"
    };

    console.log(Image.band);


// get  current position from browser, return Latitude and Longitude
var browserLatitude, browserLongitude;

(function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            browserLatitude = position.coords.latitude;
            browserLongitude = position.coords.longitude; 
       
        });
    } else { 
        // for testing
        console.log("Geolocation is not supported by this browser.");
    }
})();

});