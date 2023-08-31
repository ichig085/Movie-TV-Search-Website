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
    else if (media_type == "person" || getPerson == true) {
      sessionStorage.removeItem("person");
      sessionStorage.removeItem("name");
      url = `https://api.themoviedb.org/3/person/${movieID}?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US`;
    } else {
      // console.log(sessionStorage.getItem("url1"))
      if (sessionStorage.getItem("url1").includes("/movie")) {
        url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
      } else if (sessionStorage.getItem("url1").includes("/tv")) {
        url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
      } else {
        url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
      }
    }

    try {
      $("results").html("");
      $.getJSON(url, function (jsonData) {
        var image = "https://image.tmdb.org/t/p/w500/";
        console.log("aorfaioef;aoej");
        console.log(url);
        console.log(jsonData);
        console.log("aierjfa;ojfr;aoeijrfa;oeirfjaofjia");
        var movie = "";
        if (
          jsonData.profile_path == null ||
          jsonData.hasOwnProperty("profile_path") == false
        ) {
          image = "https://via.placeholder.com/360x500";
        } else {
          image += jsonData.profile_path;
        }

        //media_type may be able to be removed from here
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

                // console.log(isChar)
                if (
                  jsonData.biography.charAt(i) == "." &&
                  isCharBefore == true &&
                  isCharAfter == true &&
                  isCharAfter2 == true
                ) {
                  continue;
                } else {
                  // console.log(break_paragraph);
                  break_paragraph++;
                }
                if (
                  break_paragraph % 4 == 0 &&
                  jsonData.biography.charAt(i) == "."
                ) {
                  // console.log("break created")
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
            $.getJSON(url, function (jsonData) {
              console.log("cast info");
              console.log(jsonData);

              var castMax = 5;
              // sessionStorage.setItem("cast_id", jsonData.cast_id[]);
              if (jsonData.cast[0].hasOwnProperty("name")) {
                console.log("cast name called");
                sessionStorage.setItem("name", jsonData.cast[0].name);
              }

              if (jsonData.cast.length < castMax) {
                castMax = jsonData.cast.length;
              }

              for (var i = 0; i < castMax; i++) {
                if (
                  !jsonData.cast[i].hasOwnProperty("profile_path") ||
                  jsonData.cast[i].profile_path == null
                ) {
                  image = "https://via.placeholder.com/360x500";
                } else {
                  image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
                }

                cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
              }

              console.log(jsonData);

              $(".div33").append(cast).css({ "margin-top": "0" });
              getPerson = true;
              console.log(getPerson);
              $(".movieID").on("click", function () {
                getVideoOrPersonDetails($(this).attr("id"));
              });
            });
          } catch (error) {
            cast = "We don't have any cast to add to this show";
            $(".div33").append(cast).css({ "margin-top": "0" });
            getPerson = false;
            console.log(getPerson);
          }
          var title = "";
          var overview = "";
          var genres = "";
          var vote = Math.round(jsonData.vote_average);
          var release_date = "";
          var runtimeHours = "";
          var runtimeMinutes = "";

          if (
            (jsonData.hasOwnProperty("overview") == true &&
              jsonData.overview == "") ||
            (jsonData.hasOwnProperty("overview") && jsonData.overview == null)
          ) {
            if (jsonData.original_langauge != "en") {
              overview =
                "We don't have an overview translated in English. Please be assured we're working deligently to update this.";
            } else {
              overview =
                "We don't have an overview for this show at the moment. Please be assured we're working deligently to update this.";
            }
          } else {
            console.log("else language called");
            overview = jsonData.overview;
          }

          if (url.includes("/movie")) {
            release_date = jsonData.release_date;
            var runtimeHours = Math.floor(jsonData.runtime / 60) + "hr";
            runtimeMinutes = (jsonData.runtime % 60) + "min";
            console.log("movie");
          } else if (url.includes("/tv")) {
            var release_date = jsonData.first_air_date;

            if (jsonData.episode_run_time.length > 0) {
              runtimeMinutes = "| " + jsonData.episode_run_time + "min";
            } else {
              runtimeHours = "";
              runtimeMinutes = "";
            }

            console.log("tv");
          }

          if (jsonData.hasOwnProperty("name")) {
            title = jsonData.name;
          } else {
            title = jsonData.original_title;
          }
          if (jsonData.poster_path == null) {
            image = "https://via.placeholder.com/360x500";
          } else {
            image += jsonData.poster_path;
          }

          if (jsonData.hasOwnProperty("genres")) {
            //removes final comma
            genres = " | ";
            for (var i = 0; i < jsonData.genres.length; i++) {
              if (i == jsonData.genres.length - 1) {
                //finish creating links for user clicks to take to similar genre
                genres += `<a href="#" id=${jsonData.genres[i].id}>${jsonData.genres[i].name}</a>`;
              } else {
                genres += `<a href="#">${jsonData.genres[i].name}</a>, `;
              }
            }
          } else {
            genres = "";
          }

          movie += `<div class='div22' style='margin-left: 1.85rem; margin-bottom:0; width: 50%'><h2 style='margin-bottom:0;'>${title}</h2>`;
          movie += `<p style='margin-top: .25rem; font-size: .80rem;'>${release_date} ${genres} ${runtimeHours} ${runtimeMinutes}</p>`;
          movie += "<h3 style='margin-bottom: 0;'>Overview</h3>";
          movie += `<p style='font-size:1.15rem; margin-top: .25rem;'>${overview}</p>`;
          movie += "<h3 style='margin-bottom: .25rem;'>Cast</h3>";
          movie += "</div>";
          movie += `<div class='div11' style='margin-left:2rem; margin-top: 1.5rem;'><img src='${image}' style='width: 100%; height: 57%;'/>`;
          movie += "</div>";

          $("#results").html("");
          $(".parent").html("");
          $(".parent1").append(movie);
        } else {
          console.log(url);
          console.log("last else for cast called");
          console.log("this is url1", sessionStorage.getItem("url1"));
          var cast = "";
          image = `https://image.tmdb.org/t/p/w500/`;
          console.log("anime=>", url);
          //may be possible to remove sessionstore and just use url.include for these just like
          //trending
          if (
            sessionStorage.getItem("url1").includes("/movie") ||
            sessionStorage.getItem("url1").includes("/multi") ||
            url.includes("/movie")
          ) {
            console.log("last else this got called tooooo");
            url = `https://api.themoviedb.org/3/movie/${movieID}/credits?${api_key}&language=en-US`;
          } else if (sessionStorage.getItem("url1").includes("/tv")) {
            url = `https://api.themoviedb.org/3/tv/${movieID}/credits?${api_key}&language=en-US`;
          }

          //https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=<<api_key>>&language=en-US
          $.getJSON(url, function (jsonData) {
            console.log(jsonData);
            if (jsonData.cast[0].hasOwnProperty("name")) {
              sessionStorage.setItem("name", jsonData.cast[0].name);
            }
            var castMax = 5;

            if (jsonData.cast.length < castMax) {
              castMax = jsonData.cast.length;
            }
            for (var i = 0; i < castMax; i++) {
              sessionStorage.setItem("name", jsonData.cast[0].name);
              if (
                !jsonData.cast[i].hasOwnProperty("profile_path") ||
                jsonData.cast[i].profile_path == null
              ) {
                image = "https://via.placeholder.com/360x500";
              } else {
                image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
              }

              cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
            }

            console.log(jsonData);

            $(".div33").append(cast).css({ "margin-top": "0" });
            getPerson = true;
            $(".movieID").on("click", function () {
              getVideoOrPersonDetails($(this).attr("id"));
            });
          });
          var title = "";
          var overview = jsonData.overview;
          var genres = "";
          var vote = Math.round(jsonData.vote_average);
          var release_date = "";
          var runtimeMinutes = "";

          if (url.includes("/movie")) {
            release_date = jsonData.release_date;
            var runtimeHours = Math.floor(jsonData.runtime / 60) + "hr";
            runtimeMinutes = (jsonData.runtime % 60) + "min";
            console.log("movie");
          } else if (url.includes("/tv")) {
            var release_date = jsonData.first_air_date;
            var runtimeMinutes = jsonData.episode_run_time + "min";

            console.log("tv");
          }

          if (jsonData.hasOwnProperty("name")) {
            title = jsonData.name;
          } else {
            title = jsonData.original_title;
          }
          if (jsonData.poster_path == null) {
            image = "https://via.placeholder.com/360x500";
          } else {
            image += jsonData.poster_path;
          }
          if (jsonData.hasOwnProperty("genres")) {
            for (var i = 0; i < jsonData.genres.length; i++) {
              if (i == jsonData.genres.length - 1) {
                genres += `${jsonData.genres[i].name}`;
              } else {
                genres += `${jsonData.genres[i].name}, `;
              }
            }
          }
          //add top word to res
          movie += `<div class='div22' style='margin-left: 1.85rem; margin-bottom:0; width: 50%'><h2 style='margin-bottom:0;'>${title}</h2>`;
          movie += `<p style='margin-top: .25rem; font-size: .80rem;'>${release_date} | ${genres} | ${runtimeHours} ${runtimeMinutes}</p>`;
          movie += "<h3 style='margin-bottom: 0;'>Overview</h3>";
          movie += `<p style='font-size:1.15rem; margin-top: .25rem;'>${overview}</p>`;
          movie += "<h3 style='margin-bottom: .25rem;'>Top Cast</h3>";
          movie += "</div>";
          movie += `<div class='div11' style='margin-left:2rem; margin-top: 1.5rem;'><img src='${image}' style='width: 100%; height: 57%;'/>`;
          movie += "</div>";

          $("#results").html("");
          $(".parent").html("");
          $(".parent1").append(movie);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Click event for switching to list layout
$("#listLayout").click(function () {
    // Change the display and flex-direction properties to achieve list layout
    $("#results").css({
        display: "flex",
        "flex-direction": "column"
    });
});

// Click event for switching to grid layout
$("#gridLayout").click(function () {
    // Change the display, flex-wrap, and flex-direction properties to achieve grid layout
    $("#results").css({
        display: "flex",
        "flex-wrap": "wrap",
        "flex-direction": "row"
    });
});
});