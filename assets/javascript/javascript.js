
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
});