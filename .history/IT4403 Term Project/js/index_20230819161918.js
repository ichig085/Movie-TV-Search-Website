$(document).ready(function () {
    // Clear session store when the page is reloaded
sessionStorage.clear();

// Save URLs for future use
sessionStorage.setItem("url1", `https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=`);
sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");

const api_key = "api_key=596a559ed3e4a3408502d51411f3d607";

// Hide layout buttons initially
$("#listLayout, #gridLayout").hide();

// Initialize variables
var url = sessionStorage.getItem("url1");
var multi_media_type = {};
var getPerson = false;
var isDiscoverMovie = false;
var isDiscoverTV = false;
var isMultiSearch = true;

// Initialize the initial search
searchVidoesandPeople(url);

// Click event to handle returning home
$(".home").click(function() {
    $(".trending").show();
    url = sessionStorage.getItem("url1");
    sessionStorage.clear();
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=`);
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    searchVidoesandPeople(url);
});

// Click event to handle "multi search" content
$("#button1").click(function() {
    $(".trending").hide();
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    isDiscoverMovie = false;
    isDiscoverTV = false;
    sessionStorage.removeItem("media_type");
    sessionStorage.removeItem("name");
    var isAdult = $("input[name='safeSearch']:checked").val();
    url = `https://api.themoviedb.org/3/search/multi?query=${$("#searchTerm").val()}&${api_key}&language=en-US&page=1&include_adult=${isAdult}`;
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/search/multi?${api_key}&language=en-US&query=${$("#searchTerm").val()}&language=en-US&include_adult=false&page=`);
    sessionStorage.setItem("url2", "&language=en-US&include_adult=false");
    searchVidoesandPeople(url);
});

// Click event to handle "discover movies" content
$("#movies").click(function () {
    $(".trending").hide();
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    sessionStorage.removeItem("media_type");
    sessionStorage.removeItem("name");
    isDiscoverMovie = true;
    isDiscoverTV = false;
    var isAdult = $("input[name='safeSearch']:checked").val();
    url = `https://api.themoviedb.org/3/discover/movie?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/discover/movie?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`);
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    searchVidoesandPeople(url);
});

// Click event to handle "discover tv" content
$("#tv").click(function () {
    $(".trending").hide();
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    sessionStorage.removeItem("media_type");
    sessionStorage.removeItem("name");
    isDiscoverTV = true;
    isDiscoverMovie = false;
    var isAdult = $("input[name='safeSearch']:checked").val();
    url = `https://api.themoviedb.org/3/discover/tv?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/discover/tv?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`);
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    searchVidoesandPeople(url);
});

// Click events to navigate pages
$("#pages").on('click', function (event) {
    var number = $(event.target).text();
    url = sessionStorage.getItem("url1") + number + sessionStorage.getItem("url2");
    searchVidoesandPeople(url);
});

// Function to search for videos and people
function searchVidoesandPeople(servicePoint) {
    // Clear containers and set flags
    $(".cast, .div11, .div22, .div33").empty();
    isMultiSearch = servicePoint.includes("/multi") || servicePoint.includes("/trending");
    $("#listLayout, #gridLayout, #pages").show();
    $("#results").html("Searching ...");

    // Perform AJAX request
    $.getJSON(servicePoint, function (jsonData) {
        // Rest of your existing code...
    });
}


    // Function to get details of a video or person based on their ID
function getVideoOrPersonDetails(movieID) {
    console.log(getPerson);
    $(window).scrollTop(0);

    // Hide trending section
    $(".trending").hide();
    console.log("multi_media_type is:");
    console.log(multi_media_type[movieID]);
    
    // Clear content containers
    $(".cast").empty();
    $(".div11").empty();
    $(".div22").empty();
    $(".div33").empty();
    $("#results").html("Loading...");

    // Hide pagination and layout buttons
    $("#pages").hide();
    $("#listLayout").hide();
    $("#gridLayout").hide();
    
    // Retrieve media type and person name from sessionStorage
    var media_type = sessionStorage.getItem("media_type");
    var personName = sessionStorage.getItem("name");

    // Determine the URL based on media type and context
    var url = "";
    if (multi_media_type[movieID] == "tv" || isDiscoverTV) {
        isDiscoverTV = false;
        url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
    } else if (multi_media_type[movieID] == "movie" || isDiscoverMovie) {
        isDiscoverMovie = false;
        url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
    } else if (multi_media_type[movieID] == "person" || getPerson) {
        getPerson = false;
        url = `https://api.themoviedb.org/3/person/${movieID}?${api_key}&language=en-US`;
    } else {
        // Handle other cases, possibly using session storage URL
    }

    try {
        // Fetch JSON data
        $.getJSON(url, function (jsonData) {
            // Process the data and populate content

            // Example: Create movie details section
            var movieDetails = "";
            movieDetails += `<h2>${jsonData.title}</h2>`;
            movieDetails += `<p>${jsonData.overview}</p>`;
            // ... other details ...

            // Append content to appropriate containers
            $(".div11").append(movieDetails);

            // Example: Process cast data
            var castData = jsonData.credits.cast;
            var castSection = "<h3>Cast</h3>";
            castData.forEach(actor => {
                // Create actor card and append to castSection
            });
            $(".div33").append(castSection);

            // Example: Update layout buttons
            $("#listLayout").click(function () {
                $("#results").css({ "display": "flex", "flex-direction": "column" });
            });

            $("#gridLayout").click(function () {
                $("#results").css({ "display": "flex", "flex-wrap": "wrap", "flex-direction": "row" });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

});