$(document).ready(function () {
  // Clear session storage to ensure a clean state on page reload
  sessionStorage.clear();

  // Set initial URLs for pagination and API key
  sessionStorage.setItem(
    "url1",
    `https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=`
  );
  sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
  const api_key = "api_key=596a559ed3e4a3408502d51411f3d607";

  // Hide list & grid view buttons by default
  $("#listLayout, #gridLayout").hide();

  // Initial URL for trending content
  var url =
    "https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=1";

  // Object to store media types
  var multi_media_type = {};

  // Boolean flags for content types and search mode
  var getPerson = false;
  var isDiscoverMovie = false;
  var isDiscoverTV = false;
  var isMultiSearch = true;

  // Load trending content initially
  searchVidoesandPeople(url);

  // Click event to handle user's request for returning home
  $(".home").click(function () {
    $(".trending").show();
    url =
      "https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=1";
    sessionStorage.clear();
    sessionStorage.setItem(
      "url1",
      `https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=`
    );
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    searchVidoesandPeople(url);
  });

  // Click event to handle user's request for "multi search" content
  $("#button1").click(function () {
    $(".trending").hide();
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    isDiscoverMovie = false;
    isDiscoverTV = false;
    if (
      sessionStorage.getItem("media_type") ||
      sessionStorage.getItem("name")
    ) {
      sessionStorage.removeItem("media_type");
      sessionStorage.removeItem("name");
    }

    var isAdult = $("input[name='safeSearch']:checked").val();
    url = `https://api.themoviedb.org/3/search/multi?query=${$(
      "#searchTerm"
    ).val()}&${api_key}&language=en-US&page=1&include_adult=${isAdult}`;
    sessionStorage.setItem(
      "url1",
      `https://api.themoviedb.org/3/search/multi?${api_key}&language=en-US&query=${$(
        "#searchTerm"
      ).val()}&language=en-US&include_adult=false&page=`
    );
    sessionStorage.setItem("url2", "&language=en-US&include_adult=false");

    searchVidoesandPeople(url);
  });
  // Click function to handle user requests for "discover movies" content
$("#movies").click(function () {
    // Hide trending content
    $(".trending").hide();
    
    // Clear existing content containers
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    
    // Remove session storage items related to media type and name
    sessionStorage.removeItem("media_type");
    sessionStorage.removeItem("name");
    
    // Set flags for content types
    isDiscoverMovie = true;
    isDiscoverTV = false;
    
    // Get user's safe search preference
    var isAdult = $("input[name='safeSearch']:checked").val();
    
    // Set the URL for discovering movies
    url = `https://api.themoviedb.org/3/discover/movie?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    
    // Update session storage URLs
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/discover/movie?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`);
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    
    // Perform the search and populate content
    searchVidoesandPeople(url);
});

// Click function to handle user requests for "discover tv" content
$("#tv").click(function () {
    // Hide trending content
    $(".trending").hide();
    
    // Clear existing content containers
    $(".div11, .div22, .div33").empty();
    $("#results, .parent").html("");
    
    // Remove session storage items related to media type and name
    sessionStorage.removeItem("media_type");
    sessionStorage.removeItem("name");
    
    // Set flags for content types
    isDiscoverTV = true;
    isDiscoverMovie = false;
    
    // Get user's safe search preference
    var isAdult = $("input[name='safeSearch']:checked").val();
    
    // Set the URL for discovering TV shows
    url = `https://api.themoviedb.org/3/discover/tv?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    
    // Update session storage URLs
    sessionStorage.setItem("url1", `https://api.themoviedb.org/3/discover/tv?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`);
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");
    
    // Perform the search and populate content
    searchVidoesandPeople(url);
});


  // Click event for paging
$("#pages").on("click", function (event) {
    // Get the page number from the clicked element
    var number = $(event.target).text();
    
    // Construct the URL for the requested page
    url = sessionStorage.getItem("url1") + number + sessionStorage.getItem("url2");
    
    // Get user's safe search preference
    var isAdult = $("input[name='safeSearch']:checked").val();

    // Perform a new search using the constructed URL
    searchVidoesandPeople(url);
});

// Function to perform videos and people search
function searchVidoesandPeople(servicePoint) {
    // Clear content containers and flags
    $(".cast, .div11, .div22, .div33").empty();
    isMultiSearch = servicePoint.includes("/multi") || servicePoint.includes("/trending");
    
    // Show layout and paging elements
    $("#listLayout, #gridLayout, #pages").show();
    
    // Initialize variables
    var image = "", title = "", vote_average = "";
    var isAdult = $("input[name='user_selection']:checked").val();
    
    // Show searching message
    $("#results").html("Searching ...");
    
    // Fetch JSON data using AJAX
    $.getJSON(servicePoint, function (jsonData) {
        // Clear previous paging links
        $("#pages").html("Pages: ");

        // Load page numbers for user
        var totalPages = Math.min(jsonData.total_pages, 5);
        for (var i = 1; i <= totalPages; i++) {
            $("#pages").append(`<a class='page' href='#'>${i}</a> `);
        }

        // Clear search results
        $("#results").html("");

        // Check if multiSearch is needed
        if (isMultiSearch || jsonData.results[0]?.media_type) {
            // Initialize multi_media_type if needed
            if (Object.keys(multi_media_type).length) {
                Object.keys(multi_media_type).forEach(key => delete multi_media_type[key]);
            }

            // Loop through results and populate content
            jsonData.results.forEach(result => {
                vote_average = Math.round(result.vote_average);
                multi_media_type[result.id] = result.media_type;

                image = result.poster_path || result.profile_path;
                image = image ? `https://image.tmdb.org/t/p/w500/${image}` : "https://via.placeholder.com/360x500";

                title = result.name || result.title;

                const videoOrPersonDiv = `
                    <div class='vidOrPersonContainer'>
                        <img style='cursor:pointer' class='movieID' id='${result.id}' src='${image}' />
                        <h3 style='padding:3%;'>${title}</h3>
                        <p style='padding: 3%; margin-top: 1rem;'>Rating: ${vote_average}</p>
                    </div>`;

                $("#results").append(videoOrPersonDiv);
            });

            // Store multi_media_type in session storage
            sessionStorage.setItem("multi_media_type", JSON.stringify(multi_media_type));
        } else {
            // Loop through results and populate content
            jsonData.results.forEach(result => {
                vote_average = Math.round(result.vote_average);
                image = result.poster_path || result.profile_path;
                image = image ? `https://image.tmdb.org/t/p/w500/${image}` : "https://via.placeholder.com/360x500";

                title = result.name || result.title;

                const videoOrPersonDiv = `
                    <div class='vidOrPersonContainer'>
                        <img style='cursor:pointer' class='movieID' id='${result.id}' src='${image}' />
                        <h3 style='padding:3%; margin-bottom: 0;'>${title}</h3>
                        <p style='padding: 3%; margin-top: 1rem;'>Rating: ${vote_average}</p>
                    </div>`;

                $("#results").append(videoOrPersonDiv);
            });
        }

        // Attach click event handler to movie elements
        $(".movieID").on("click", function () {
            getVideoOrPersonDetails($(this).attr("id"));
        });
    });
}


function getVideoOrPersonDetails(movieID) {
    console.log(getPerson);
    $(window).scrollTop(0);

    // Hide trending section
    $(".trending").hide();
    
    // Clear content containers
    $(".cast, .div11, .div22, .div33").empty();
    $("#results").html("Loading . . .");
    $("#pages, #listLayout, #gridLayout").hide();

    // Retrieve session data
    var media_type = sessionStorage.getItem("media_type");
    var personName = sessionStorage.getItem("name");
    
    // Determine the URL based on media type and context
    var url = determineURL(movieID);

    try {
        if (true) {
            console.log(url);
        }
        // Clear previous content
        $("results").html("");
        
        // Fetch JSON data using AJAX
        $.getJSON(url, function (jsonData) {
            var image = "https://image.tmdb.org/t/p/w500/";

            // Handle content based on media type
            if (media_type == "person" || personName || multi_media_type[movieID] == "person") {
                // ... (Person content handling)
            } else if (url.includes("/tv")) {
                // ... (TV show content handling)
            } else {
                // ... (Movie content handling)
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Function to determine the URL based on context
function determineURL(movieID) {
    // ... (URL determination logic based on multi_media_type, media_type, and context)
    return url;
}


  $("#listLayout").click(function () {
    $("#results").css({ display: "flex", "flex-direction": "column" });
  });

  $("#gridLayout").click(function () {
    $("#results").css({
      display: "flex",
      "flex-wrap": "wrap",
      "flex-direction": "row",
    });
  });
});