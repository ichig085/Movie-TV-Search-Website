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
    sessionStorage.setItem(
      "url1",
      `https://api.themoviedb.org/3/discover/movie?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`
    );
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
    sessionStorage.setItem(
      "url1",
      `https://api.themoviedb.org/3/discover/tv?${api_key}&language=en-US&sort_by=popularity.desc&include_adult=${isAdult}&include_video=false&page=`
    );
    sessionStorage.setItem("url2", "&with_watch_monetization_types=flatrate");

    // Perform the search and populate content
    searchVidoesandPeople(url);
  });

  // Click event for paging
  $("#pages").on("click", function (event) {
    // Get the page number from the clicked element
    var number = $(event.target).text();

    // Construct the URL for the requested page
    url =
      sessionStorage.getItem("url1") + number + sessionStorage.getItem("url2");

    // Get user's safe search preference
    var isAdult = $("input[name='safeSearch']:checked").val();

    // Perform a new search using the constructed URL
    searchVidoesandPeople(url);
  });

  // Function to perform videos and people search
  function searchVidoesandPeople(servicePoint) {
    // Clear content containers and flags
    $(".cast, .div11, .div22, .div33").empty();
    isMultiSearch =
      servicePoint.includes("/multi") || servicePoint.includes("/trending");

    // Show layout and paging elements
    $("#listLayout, #gridLayout, #pages").show();

    // Initialize variables
    var image = "",
      title = "",
      vote_average = "";
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
          Object.keys(multi_media_type).forEach(
            (key) => delete multi_media_type[key]
          );
        }

        // Loop through results and populate content
        jsonData.results.forEach((result) => {
          vote_average = Math.round(result.vote_average);
          multi_media_type[result.id] = result.media_type;

          image = result.poster_path || result.profile_path;
          image = image
            ? `https://image.tmdb.org/t/p/w500/${image}`
            : "https://via.placeholder.com/360x500";

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
        sessionStorage.setItem(
          "multi_media_type",
          JSON.stringify(multi_media_type)
        );
      } else {
        // Loop through results and populate content
        jsonData.results.forEach((result) => {
          vote_average = Math.round(result.vote_average);
          image = result.poster_path || result.profile_path;
          image = image
            ? `https://image.tmdb.org/t/p/w500/${image}`
            : "https://via.placeholder.com/360x500";

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
    // Scroll to the top of the page
    $(this).scrollTop(0);

    // Hide trending elements
    $(".trending").hide();

    // Clear content from various HTML elements
    $(".cast").empty();
    $(".div11").empty();
    $(".div22").empty();
    $(".div33").empty();
    $("#results").html("");
    $("#results").html("Loading . . .");
    $("#pages").hide();
    $("#listLayout").hide();
    $("#gridLayout").hide();

    // Retrieve values from session storage
    var media_type = sessionStorage.getItem("media_type");
    var personName = sessionStorage.getItem("name");

    // Check conditions to determine the API endpoint URL
    if (multi_media_type[movieID] == "tv" || isDiscoverTV) {
      isDiscoverTV = false;
      url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
    } else if (multi_media_type[movieID] == "movie" || isDiscoverMovie) {
      isDiscoverMovie = false;
      url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
    } else if (multi_media_type[movieID]) {
      url = `https://api.themoviedb.org/3/person/${movieID}?${api_key}&language=en-US`;
    } else if (multi_media_type[movieID] == "person" || getPerson) {
      getPerson = false;
      url = `https://api.themoviedb.org/3/person/${movieID}?${api_key}&language=en-US`;
    }
    //may be possible to delete this later
    // else if (media_type == "person" || getPerson == true) {
    //   sessionStorage.removeItem("person");
    //   sessionStorage.removeItem("name");
    //   url = `https://api.themoviedb.org/3/person/${movieID}?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US`;
    // } else {
    //   // console.log(sessionStorage.getItem("url1"))
    //   if (sessionStorage.getItem("url1").includes("/movie")) {
    //     url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
    //   } else if (sessionStorage.getItem("url1").includes("/tv")) {
    //     url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
    //   } else {
    //     url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
    //   }
    // }

    // Try to retrieve and display data from the API
    try {
      $("results").html("");
      $.getJSON(url, function (jsonData) {
        // Process data based on media type and URL
        var image = "https://image.tmdb.org/t/p/w500/";
        var movie = "";

        if (
          jsonData.profile_path == null ||
          jsonData.hasOwnProperty("profile_path") == false
        ) {
          image = "https://via.placeholder.com/360x500";
        } else {
          image += jsonData.profile_path;
        }

        if (
          sessionStorage.getItem("media_type") == "person" ||
          sessionStorage.getItem("name") != null ||
          multi_media_type[movieID] == "person"
        ) {
          var name = jsonData.name;
          var birthday = jsonData.birthday;
          var biography = "";
          var known_for = jsonData.known_for_department;
          var gender = jsonData.gender;
          var birthday = "";
          var place_of_birth = "";
          var also_known_as = "";

          var break_paragraph = 0;
          if (jsonData.hasOwnProperty("biography")) {
            if (jsonData.biography == "") {
              biography = `We don't have a biography for ${name}`;
            } else {
              for (var i = 0; i < jsonData.biography.length; i++) {
                biography += jsonData.biography.charAt(i);
                var isCharBefore = /^[a-zA-Z]+$/.test(
                  jsonData.biography.charAt(i - 1)
                );
                var isCharAfter = /^[a-zA-Z]+$/.test(
                  jsonData.biography.charAt(i + 1)
                );
                var isCharAfter2 = /^[a-zA-Z]+$/.test(
                  jsonData.biography.charAt(i + 3)
                );

                if (
                  jsonData.biography.charAt(i) == "." &&
                  isCharBefore == true &&
                  isCharAfter == true &&
                  isCharAfter2 == true
                ) {
                  continue;
                } else {
                  break_paragraph++;
                }
                if (
                  break_paragraph % 4 == 0 &&
                  jsonData.biography.charAt(i) == "."
                ) {
                  biography += "<br><br>";
                }
              }
            }
          }

          if (jsonData.birthday == "" || jsonData.birthday == null) {
            birthday = "-";
          } else {
            birthday = jsonData.birthday;
          }

          if (
            jsonData.place_of_birth == "" ||
            jsonData.place_of_birth == null
          ) {
            place_of_birth = "-";
          } else {
            if (jsonData.place_of_birth.includes("Hong Kong")) {
              place_of_birth = "Hong Kong SAR";
            } else {
              place_of_birth = jsonData.place_of_birth;
            }
          }

          if (jsonData.hasOwnProperty("also_known_as")) {
            if (
              jsonData.also_known_as == "" ||
              jsonData.also_known_as == null
            ) {
              also_known_as = "-";
            } else {
              for (var i = 0; i < jsonData.also_known_as.length; i++) {
                also_known_as += `<p style='margin-top:.25rem; font-size: 1.15rem;'>${jsonData.also_known_as[i]}</p>`;
              }
            }
          } else {
            also_known_as += `<p style='margin-top:.25rem; font-size: 1.15rem;'>No information found.</p>`;
          }
          if (gender == "1") {
            gender = "Female";
          } else if (gender == "2") {
            gender = "Male";
          } else if (gender == "3") {
            gender = "Non-binary";
          } else {
            gender = "-";
          }
          //changed div1 to div11 and same with div2 to div22
          movie = `<div class='div11'><img src='${image}' style='width: 100%; height: auto;'/><h3>Personal Info</h3><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Known For</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${known_for}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Gender</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${gender}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Birthday</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${birthday}</p><p class='personalInfo' style='font-weight: bold; margin-bottom:0;'>Place of Birth</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${place_of_birth}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Also Known As</p><p class='personalInfoBody';>${also_known_as}</p></div>`;
          movie += `<div class='div22' style='width:80%;'><h2 style='padding-left: 1rem; margin-top: 0;'>${name}</h2><h3 style='padding-left: 1rem; margin-bottom: .5rem;'>Biography</h3><p style='font-size:1.15rem; padding-left: 1rem; margin-top: 0;'>${biography}</p></div>`;

          $("#results").html("");
          $(".parent").html("");
          $(".parent").append(movie);
          getPerson = false;
        } else if (url.includes("/tv")) {
          var cast = "";
          image = `https://image.tmdb.org/t/p/w500/`;

          url = `https://api.themoviedb.org/3/tv/${movieID}/credits?${api_key}&language=en-US`;

          try {
            // Fetch JSON data from the specified 'url' and process it using a callback function
            $.getJSON(url, function (jsonData) {
                // Set the maximum number of cast members to be displayed
                var castMax = 5;

                // Store the name of the first cast member in the session storage if available
                if (jsonData.cast[0].hasOwnProperty("name")) {
                    sessionStorage.setItem("name", jsonData.cast[0].name);
                }

                // If the actual number of cast members is less than 'castMax', update 'castMax'
                if (jsonData.cast.length < castMax) {
                    castMax = jsonData.cast.length;
                }

                // Loop through the cast members up to the 'castMax' limit
                for (var i = 0; i < castMax; i++) {
                    // Check if the current cast member doesn't have a 'profile_path' or it's null
                    if (
                    !jsonData.cast[i].hasOwnProperty("profile_path") ||
                    jsonData.cast[i].profile_path == null
                    ) {
                    // If no profile image is available, use a placeholder image URL
                    image = "https://via.placeholder.com/360x500";
                    } else {
                    // Use the image URL from the JSON data for the current cast member
                    image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
                    }
                
                    // Construct the HTML content for the current cast member with their image and name
                    cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
                }
                
                // Append the constructed 'cast' HTML content to the element with class 'div33'
                $(".div33").append(cast).css({ "margin-top": "0" });
                
                // Set 'getPerson' to true to indicate that person information is being retrieved
                getPerson = true;
                
                // Attach a click event handler to elements with class 'movieID'
                $(".movieID").on("click", function () {
                    // Call the 'getVideoOrPersonDetails' function with the clicked element's ID
                    getVideoOrPersonDetails($(this).attr("id"));
                });
            });
          } catch (error) {
            // Handle the error case where cast information is not available

                // Set the 'cast' message to indicate no cast information is available
                cast = "We don't have any cast to add to this show";

                // Append the 'cast' message to the element with class 'div33'
                $(".div33").append(cast).css({ "margin-top": "0" });

                // Set 'getPerson' to false to indicate that person information is not being retrieved
                getPerson = false;
            }
          
            // Initialize variables to store various information about the movie or show
            var title = "";
            var overview = "";
            var genres = "";
            var vote = Math.round(jsonData.vote_average);
            var release_date = "";
            var runtimeHours = "";
            var runtimeMinutes = "";

            // Check if overview information is available and handle the cases
            if (
            (jsonData.hasOwnProperty("overview") == true && jsonData.overview == "") ||
            (jsonData.hasOwnProperty("overview") && jsonData.overview == null)
            ) {
            // Handle the case where overview is missing or empty

            if (jsonData.original_langauge != "en") {
                // If the original language is not English, provide a translation message
                overview =
                "We don't have an overview translated in English. Please be assured we're working diligently to update this.";
            } else {
                // If the original language is English, provide a general missing overview message
                overview =
                "We don't have an overview for this show at the moment. Please be assured we're working diligently to update this.";
            }
            } else {
            // If overview is available, assign it to the 'overview' variable
            console.log("else language called");
            overview = jsonData.overview;
            }


            // Check if the URL indicates a movie or a TV show
            if (url.includes("/movie")) {
                // If the content is a movie
                release_date = jsonData.release_date; // Assign the release date of the movie
            
                // Calculate runtime hours and minutes
                var runtimeHours = Math.floor(jsonData.runtime / 60) + "hr"; // Calculate hours
                runtimeMinutes = (jsonData.runtime % 60) + "min"; // Calculate remaining minutes
            } else if (url.includes("/tv")) {
                // If the content is a TV show
                var release_date = jsonData.first_air_date; // Assign the first air date of the TV show
            
                if (jsonData.episode_run_time.length > 0) {
                // Check if episode runtime information is available
                runtimeMinutes = "| " + jsonData.episode_run_time + "min"; // Assign episode runtime
                } else {
                runtimeHours = ""; // If episode runtime information is not available, reset hours
                runtimeMinutes = ""; // and minutes
                }
            }
  

            // Check if the JSON data has the property "name"
            if (jsonData.hasOwnProperty("name")) {
                title = jsonData.name; // Assign the value of "name" property to the title variable
            } else {
                title = jsonData.original_title; // If "name" property is not present, assign "original_title" property to the title variable
            }
            
            // Check if the "poster_path" property is null
            if (jsonData.poster_path == null) {
                image = "https://via.placeholder.com/360x500"; // If null, assign a placeholder image URL to the image variable
            } else {
                image += jsonData.poster_path; // If not null, concatenate "poster_path" property value to the image variable
            }
  

            // Check if the JSON data has the property "genres"
            if (jsonData.hasOwnProperty("genres")) {
                genres = " | "; // Initialize genres with a separator
            
                // Loop through each genre in the jsonData.genres array
                for (var i = 0; i < jsonData.genres.length; i++) {
                if (i == jsonData.genres.length - 1) {
                    // If it's the last genre, create a link with genre name and ID
                    genres += `<a href="#" id=${jsonData.genres[i].id}>${jsonData.genres[i].name}</a>`;
                } else {
                    // For other genres, create a link with genre name and comma separator
                    genres += `<a href="#">${jsonData.genres[i].name}</a>, `;
                }
                }
            } else {
                genres = ""; // If "genres" property is not present, set genres to an empty string
            }
  

          // Construct the HTML for displaying movie details
            movie += `<div class='div22' style='margin-left: 1.85rem; margin-bottom:0; width: 50%'>`;
            movie += `<h2 style='margin-bottom:0;'>${title}</h2>`; // Display movie title
            movie += `<p style='margin-top: .25rem; font-size: .80rem;'>${release_date} ${genres} ${runtimeHours} ${runtimeMinutes}</p>`; // Display release date, genres, and runtime
            movie += "<h3 style='margin-bottom: 0;'>Overview</h3>"; // Header for overview section
            movie += `<p style='font-size:1.15rem; margin-top: .25rem;'>${overview}</p>`; // Display movie overview
            movie += "<h3 style='margin-bottom: .25rem;'>Cast</h3>"; // Header for cast section
            movie += "</div>"; // End of div22

            // Construct the HTML for displaying movie image
            movie += `<div class='div11' style='margin-left:2rem; margin-top: 1.5rem;'>`;
            movie += `<img src='${image}' style='width: 100%; height: 57%;'/>`; // Display movie image
            movie += "</div>"; // End of div11

            // Clear existing content and update with the constructed movie details
            $("#results").html(""); // Clear any previous content in the results div
            $(".parent").html(""); // Clear any previous content in the parent div
            $(".parent1").append(movie); // Append the constructed movie details to the parent1 div

        } else {
          var cast = "";
          image = `https://image.tmdb.org/t/p/w500/`;
          //may be possible to remove sessionstore and just use url.include for these just like
          //trending
          if (
            sessionStorage.getItem("url1").includes("/movie") ||
            sessionStorage.getItem("url1").includes("/multi") ||
            url.includes("/movie")
          ) {
            url = `https://api.themoviedb.org/3/movie/${movieID}/credits?${api_key}&language=en-US`;
          } else if (sessionStorage.getItem("url1").includes("/tv")) {
            url = `https://api.themoviedb.org/3/tv/${movieID}/credits?${api_key}&language=en-US`;
          }

          // Make an AJAX GET request to the specified 'url' and handle the returned JSON data
          $.getJSON(url, function (jsonData) {
            // Log the received JSON data to the console
            console.log(jsonData);

            // If the first cast member has the property "name"
            if (jsonData.cast[0].hasOwnProperty("name")) {
              // Store the name of the first cast member in the session storage
              sessionStorage.setItem("name", jsonData.cast[0].name);
            }

            // Set the maximum number of cast members to be displayed
            var castMax = 5;

            // If the actual number of cast members is less than 'castMax', update 'castMax'
            if (jsonData.cast.length < castMax) {
              castMax = jsonData.cast.length;
            }

            // Loop through the cast members and process their data
            for (var i = 0; i < castMax; i++) {
              // Store the name of the first cast member in the session storage (redundant operation?)
              sessionStorage.setItem("name", jsonData.cast[0].name);

              // Check if the current cast member has a "profile_path" property or if it's null
              if (
                !jsonData.cast[i].hasOwnProperty("profile_path") ||
                jsonData.cast[i].profile_path == null
              ) {
                // Set a placeholder image URL when there's no profile image available
                image = "https://via.placeholder.com/360x500";
              } else {
                // Construct the image URL using the profile_path of the current cast member
                image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
              }

              // Create HTML content for each cast member and append it to the '.div33' element
              cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
            }

            // Append the generated 'cast' content to elements with class '.div33', adjust margin
            $(".div33").append(cast).css({ "margin-top": "0" });

            // Set the 'getPerson' flag to true
            getPerson = true;

            // Attach a click event handler to elements with class '.movieID'
            $(".movieID").on("click", function () {
              // Call the function 'getVideoOrPersonDetails' with the 'id' attribute of the clicked element
              getVideoOrPersonDetails($(this).attr("id"));
            });
          });

          // Initialize variables to store various information
          var title = ""; // Title of the movie or TV show
          var overview = jsonData.overview; // Overview or description of the movie or TV show
          var genres = ""; // String to store genre information
          var vote = Math.round(jsonData.vote_average); // Rounded average vote
          var release_date = ""; // Release date of the media
          var runtimeMinutes = ""; // Total runtime in minutes

          // Check if the URL includes "/movie" indicating a movie
          if (url.includes("/movie")) {
            release_date = jsonData.release_date; // Store movie's release date
            var runtimeHours = Math.floor(jsonData.runtime / 60) + "hr"; // Calculate runtime in hours
            runtimeMinutes = (jsonData.runtime % 60) + "min"; // Calculate remaining minutes
          } else if (url.includes("/tv")) {
            // If URL includes "/tv", indicating a TV show
            var release_date = jsonData.first_air_date; // Store TV show's first air date
            var runtimeMinutes = jsonData.episode_run_time + "min"; // Store episode runtime
          }

          // Determine the title of the media
          if (jsonData.hasOwnProperty("name")) {
            title = jsonData.name; // If "name" property exists, use it as title
          } else {
            title = jsonData.original_title; // Otherwise, use "original_title" as title
          }

          // Check if the media has a poster image
          if (jsonData.poster_path == null) {
            image = "https://via.placeholder.com/360x500"; // Use placeholder image URL
          } else {
            image += jsonData.poster_path; // Append poster image path to base URL
          }

          // Check if the media has genre information
          if (jsonData.hasOwnProperty("genres")) {
            // Iterate through genres and build the genres string
            for (var i = 0; i < jsonData.genres.length; i++) {
              if (i == jsonData.genres.length - 1) {
                genres += `${jsonData.genres[i].name}`; // If last genre, append without comma
              } else {
                genres += `${jsonData.genres[i].name}, `; // Otherwise, append with comma
              }
            }
          }

          // Generate HTML for displaying media details
          movie += `<div class='div22' style='margin-left: 1.85rem; margin-bottom:0; width: 50%'><h2 style='margin-bottom:0;'>${title}</h2>`;
          movie += `<p style='margin-top: .25rem; font-size: .80rem;'>${release_date} | ${genres} | ${runtimeHours} ${runtimeMinutes}</p>`;
          movie += "<h3 style='margin-bottom: 0;'>Overview</h3>";
          movie += `<p style='font-size:1.15rem; margin-top: .25rem;'>${overview}</p>`;
          movie += "<h3 style='margin-bottom: .25rem;'>Top Cast</h3>";
          movie += "</div>";
          movie += `<div class='div11' style='margin-left:2rem; margin-top: 1.5rem;'><img src='${image}' style='width: 100%; height: 57%;'/>`;
          movie += "</div>";

          // Append the generated content to the DOM
          $("#results").html("");
          $(".parent").html("");
          $(".parent1").append(movie);
        }
      });
    } catch (error) {
      // Handle any errors that occurred during processing
      console.log(error);
    }
  }

  // Click event for switching to list layout
  $("#listLayout").click(function () {
    // Change the display and flex-direction properties to achieve list layout
    $("#results").css({
      display: "flex",
      "flex-direction": "column",
    });
  });

  // Click event for switching to grid layout
  $("#gridLayout").click(function () {
    // Change the display, flex-wrap, and flex-direction properties to achieve grid layout
    $("#results").css({
      display: "flex",
      "flex-wrap": "wrap",
      "flex-direction": "row",
    });
  });
});
