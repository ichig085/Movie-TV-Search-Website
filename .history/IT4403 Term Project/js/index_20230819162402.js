$(document).ready(function () {
    // Clear containers for various content
function clearContainers() {
    $(".cast, .div11, .div22, .div33").empty();
}

// Generate image URL based on result data
function generateImageURL(result) {
    if (result.poster_path === null || result.profile_path === null) {
        return "https://via.placeholder.com/360x500";
    }
    return `https://image.tmdb.org/t/p/w500/${result.profile_path || result.poster_path}`;
}

// Generate HTML for a media div
function generateMediaDiv(result) {
    const image = generateImageURL(result);
    const title = result.name || result.title;
    const voteAverage = Math.round(result.vote_average);

    return `
        <div class="vidOrPersonContainer">
            <img style="cursor:pointer" class="movieID" id="${result.id}" src="${image}" />
            <h3 style="padding:3%;">${title}</h3>
            <p style="padding: 3%; margin-top: 1rem;">Rating: ${voteAverage}</p>
        </div>`;
}

// Populate search results in the UI
function populateSearchResults(results) {
    const $results = $("#results").empty();

    results.forEach(result => {
        const mediaDiv = generateMediaDiv(result);
        $results.append(mediaDiv);
    });

    // Attach click event to movie IDs
    $(".movieID").on('click', function () { getVideoOrPersonDetails($(this).attr("id")); });
}

// Search for videos and people using a service point
function searchVidoesandPeople(servicePoint) {
    // Clear previous content
    clearContainers();
    // Check if it's a multi-search or trending request
    const isMultiSearch = servicePoint.includes("/multi") || servicePoint.includes("/trending");
    // Get user's safe search choice
    const isAdult = $("input[name='user_selection']:checked").val();

    // Display searching message
    $("#results").html("Searching ...");

    // Make AJAX request to fetch data
    $.getJSON(servicePoint)
        .done(function (jsonData) {
            const results = jsonData.results;

            // Update pagination
            $("#pages").html("Pages: ");
            if (jsonData.total_pages > 5) {
                for (let i = 1; i <= 5; i++) {
                    $("#pages").append(`<a class="page" href="#">${i}</a> `);
                }
            } else {
                for (let i = 1; i <= jsonData.total_pages; i++) {
                    $("#pages").append(`<a class="page" href="#">${i}</a>`);
                }
            }

            // Store multi-media type data in session
            if (isMultiSearch || results[0]?.media_type) {
                const multi_media_type = {};
                results.forEach(result => {
                    multi_media_type[result.id] = result.media_type;
                });
                sessionStorage.setItem("multi_media_type", JSON.stringify(multi_media_type));
            }

            // Populate search results in the UI
            populateSearchResults(results);
        })
        .fail(function (error) {
            // Handle AJAX error
            $("#results").html("Error fetching data.");
            console.error("AJAX request failed:", error);
        });
}


    function getVideoOrPersonDetails(movieID) {
        console.log(getPerson);
        $(this).scrollTop(0);

        $(".trending").hide();
        console.log("multi_media_type is: ")
        console.log(multi_media_type[movieID]);
        $(".cast").empty();
        $(".div11").empty();
        $(".div22").empty();
        $(".div33").empty();
        $("#results").html("");
        $("#results").html("Loading . . .");
        $("#pages").hide();
        $("#listLayout").hide();
        $("#gridLayout").hide();
        
        var media_type = sessionStorage.getItem("media_type");
        var personName = sessionStorage.getItem("name");

        //fixed for discover tv shows click and search with tv shows
        if (multi_media_type[movieID] == "tv" || isDiscoverTV) {
            isDiscoverTV = false;
            url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
        }
        else if (multi_media_type[movieID] == "movie" || isDiscoverMovie) {
            console.log(isDiscoverMovie)
            isDiscoverMovie = false;
            url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
        }
        else if (multi_media_type[movieID]) {
            url = `https://api.themoviedb.org/3/person/${movieID}?${api_key}&language=en-US`;
        }
        else if (multi_media_type[movieID] == "person" || getPerson) {
            console.log(getPerson, multi_media_type[movieID]);
            getPerson = false;
            url = `https://api.themoviedb.org/3/person/${movieID}?${api_key}&language=en-US`;
        }
        //may be possible to delete this later
        else if (media_type == "person" || getPerson == true) {

            sessionStorage.removeItem("person");
            sessionStorage.removeItem("name");
            url = `https://api.themoviedb.org/3/person/${movieID}?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US`
        }
        else {
            // console.log(sessionStorage.getItem("url1"))
            if (sessionStorage.getItem("url1").includes("/movie")) {

                url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
            }
            else if (sessionStorage.getItem("url1").includes("/tv")) {
                url = `https://api.themoviedb.org/3/tv/${movieID}?${api_key}&language=en-US`;
            }
            else {
                url = `https://api.themoviedb.org/3/movie/${movieID}?${api_key}&language=en-US`;
            }
        }

        // console.log(url);
        try {
            if (true) {
                console.log(url);

                // $(".cast").remove();
                // $(".div11").remove();
                // $(".div22").remove();
                // $(".div33").remove();
                // $("#results").html("");
                // $("parent").empty();
                // $("parent1").empty();
            }

            // $(".cast").empty();
            // $(".div11").empty();
            // $(".div22").empty();
            // $(".div33").empty();
            $("results").html("");
            $.getJSON(url, function (jsonData) {
                var image = "https://image.tmdb.org/t/p/w500/";
                console.log("aorfaioef;aoej")
                console.log(url);
                console.log(jsonData);
                console.log('aierjfa;ojfr;aoeijrfa;oeirfjaofjia')
                var movie = "";
                if (jsonData.profile_path == null || jsonData.hasOwnProperty("profile_path") == false) {
                    image = "https://via.placeholder.com/360x500"
                }
                else {
                    image += jsonData.profile_path;
                }

                //media_type may be able to be removed from here
                if (sessionStorage.getItem("media_type") == "person" || sessionStorage.getItem("name") != null || multi_media_type[movieID] == "person") {

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
                        }
                        else {
                            for (var i = 0; i < jsonData.biography.length; i++) {
                                biography += jsonData.biography.charAt(i);
                                var isCharBefore = /^[a-zA-Z]+$/.test(jsonData.biography.charAt(i - 1));
                                var isCharAfter = /^[a-zA-Z]+$/.test(jsonData.biography.charAt(i + 1));
                                var isCharAfter2 = /^[a-zA-Z]+$/.test(jsonData.biography.charAt(i + 3));

                                // console.log(isChar)
                                if (jsonData.biography.charAt(i) == "." && isCharBefore == true && isCharAfter == true && isCharAfter2 == true) {
                                    continue;
                                }
                                else {
                                    // console.log(break_paragraph);
                                    break_paragraph++;

                                }
                                if (break_paragraph % 4 == 0 && jsonData.biography.charAt(i) == ".") {
                                    // console.log("break created")
                                    biography += "<br><br>";
                                }
                            }
                        }
                    }

                    
                    if (jsonData.birthday == "" || jsonData.birthday == null) {
                        birthday = "-";
                    }
                    else {
                        birthday = jsonData.birthday;
                    }

                    if (jsonData.place_of_birth == "" || jsonData.place_of_birth == null) {
                        place_of_birth = "-";
                    }
                    else {
                        if (jsonData.place_of_birth.includes("Hong Kong")) {
                            place_of_birth = "Hong Kong SAR"
                        }
                        else {
                            place_of_birth = jsonData.place_of_birth;
                        }
                    }
                    
                    if (jsonData.hasOwnProperty("also_known_as")) {
                        if (jsonData.also_known_as == "" || jsonData.also_known_as == null) {
                            also_known_as = "-";
                        }
                        else {
                            for (var i = 0; i < jsonData.also_known_as.length; i++) {
                                also_known_as += `<p style='margin-top:.25rem; font-size: 1.15rem;'>${jsonData.also_known_as[i]}</p>`
                            }
                        }
                    }
                    else {
                        also_known_as += `<p style='margin-top:.25rem; font-size: 1.15rem;'>No information found.</p>`
                    }
                    if (gender == "1") {
                        gender = "Female";
                    }
                    else if (gender == "2") {
                        gender = "Male";
                    }
                    else if (gender == "3") {
                        gender = "Non-binary";
                    }
                    else {
                        gender = "-"
                    }
                    //changed div1 to div11 and same with div2 to div22
                    movie = `<div class='div11'><img src='${image}' style='width: 100%; height: auto;'/><h3>Personal Info</h3><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Known For</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${known_for}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Gender</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${gender}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Birthday</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${birthday}</p><p class='personalInfo' style='font-weight: bold; margin-bottom:0;'>Place of Birth</p><p class='personalInfoBody'; style='margin-top:.25rem;'>${place_of_birth}</p><p class='personalInfo' style='font-weight:bold; margin-bottom:0;'>Also Known As</p><p class='personalInfoBody';>${also_known_as}</p></div>`
                    movie += `<div class='div22' style='width:80%;'><h2 style='padding-left: 1rem; margin-top: 0;'>${name}</h2><h3 style='padding-left: 1rem; margin-bottom: .5rem;'>Biography</h3><p style='font-size:1.15rem; padding-left: 1rem; margin-top: 0;'>${biography}</p></div>`

                    $("#results").html("");
                    $(".parent").html("");
                    $(".parent").append(movie);
                    getPerson = false;
                }
                else if (url.includes("/tv")) {
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
                                console.log("cast name called")
                                sessionStorage.setItem("name", jsonData.cast[0].name);
                            }
                            
                            if (jsonData.cast.length < castMax) {
                                
                                castMax = jsonData.cast.length;
                            }

                            for (var i = 0; i < castMax; i++) {
                                if (!jsonData.cast[i].hasOwnProperty("profile_path") || jsonData.cast[i].profile_path == null) {
                                    image = "https://via.placeholder.com/360x500";
                                }
                                else {
                                    image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
                                }

                                cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
                            }

                            console.log(jsonData);


                            $(".div33").append(cast).css({ "margin-top": "0" });
                            getPerson = true;
                            console.log(getPerson);
                            $(".movieID").on('click', function () { getVideoOrPersonDetails($(this).attr("id")); });
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

                    if (jsonData.hasOwnProperty("overview") == true && jsonData.overview == "" || jsonData.hasOwnProperty("overview") && jsonData.overview == null) {
                        if (jsonData.original_langauge != "en") {
                            overview = "We don't have an overview translated in English. Please be assured we're working deligently to update this."

                        }
                        else {
                            overview = "We don't have an overview for this show at the moment. Please be assured we're working deligently to update this."
                        }
                    }
                    else {
                        console.log("else language called")
                        overview = jsonData.overview;
                    }

                    if (url.includes("/movie")) {
                        release_date = jsonData.release_date;
                        var runtimeHours = Math.floor(jsonData.runtime / 60) + "hr";
                        runtimeMinutes = jsonData.runtime % 60 + "min";
                        console.log("movie");
                    }
                    else if (url.includes("/tv")) {
                        var release_date = jsonData.first_air_date;
                        
                        if (jsonData.episode_run_time.length > 0) {

                            runtimeMinutes = "| " + jsonData.episode_run_time + "min";
                        }
                        else {
                            runtimeHours = "";
                            runtimeMinutes = "";
                        }

                        console.log("tv");
                    }

                    if (jsonData.hasOwnProperty('name')) {
                        title = jsonData.name;
                    }
                    else {
                        title = jsonData.original_title;
                    }
                    if (jsonData.poster_path == null) {
                        image = "https://via.placeholder.com/360x500";
                    }
                    else {
                        image += jsonData.poster_path;
                    }

                    if (jsonData.hasOwnProperty("genres")) {
                        //removes final comma
                        genres = " | "
                        for (var i = 0; i < jsonData.genres.length; i++) {
                            if (i == jsonData.genres.length - 1) {
                                //finish creating links for user clicks to take to similar genre
                                genres += `<a href="#" id=${jsonData.genres[i].id}>${jsonData.genres[i].name}</a>`;
                            }
                            else {
                                genres += `<a href="#">${jsonData.genres[i].name}</a>, `;
                            }
                        }
                    }
                    else {
                        genres = "";
                    }


                    movie += `<div class='div22' style='margin-left: 1.85rem; margin-bottom:0; width: 50%'><h2 style='margin-bottom:0;'>${title}</h2>`;
                    movie += `<p style='margin-top: .25rem; font-size: .80rem;'>${release_date} ${genres} ${runtimeHours} ${runtimeMinutes}</p>`;
                    movie += "<h3 style='margin-bottom: 0;'>Overview</h3>";
                    movie += `<p style='font-size:1.15rem; margin-top: .25rem;'>${overview}</p>`;
                    movie += "<h3 style='margin-bottom: .25rem;'>Cast</h3>";
                    movie += "</div>";
                    movie += `<div class='div11' style='margin-left:2rem; margin-top: 1.5rem;'><img src='${image}' style='width: 100%; height: 57%;'/>`;
                    movie += "</div>"
                    
                    $("#results").html("");
                    $(".parent").html("");
                    $(".parent1").append(movie);

                }
                else {
                    console.log(url);
                    console.log("last else for cast called")
                    console.log("this is url1", sessionStorage.getItem("url1"));
                    var cast = "";
                    image = `https://image.tmdb.org/t/p/w500/`;
                    console.log("anime=>", url)
                    //may be possible to remove sessionstore and just use url.include for these just like
                    //trending
                    if (sessionStorage.getItem("url1").includes("/movie") || sessionStorage.getItem("url1").includes("/multi") || url.includes("/movie")) {
                        console.log("last else this got called tooooo")
                        url = `https://api.themoviedb.org/3/movie/${movieID}/credits?${api_key}&language=en-US`;
                    }
                    else if (sessionStorage.getItem("url1").includes("/tv")) {
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
                            if (!jsonData.cast[i].hasOwnProperty("profile_path") || jsonData.cast[i].profile_path == null) {
                                image = "https://via.placeholder.com/360x500";
                            }
                            else {
                                image = `https://image.tmdb.org/t/p/w500/${jsonData.cast[i].profile_path}`;
                            }

                            cast += `<div class='cast' style='margin-left:.25rem; width: 100%;'><img style='cursor: pointer; width: 100%; height: 80%;' class='movieID' id='${jsonData.cast[i].id}' src='${image}'/><p style='font-size: .95rem; margin-top:0;'>${jsonData.cast[i].name}</p></div>`;
                        }

                        console.log(jsonData);

                        $(".div33").append(cast).css({ "margin-top": "0" });
                        getPerson = true;
                        $(".movieID").on('click', function () { getVideoOrPersonDetails($(this).attr("id")); });
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
                        runtimeMinutes = jsonData.runtime % 60 + "min";
                        console.log("movie");
                    }
                    else if (url.includes("/tv")) {
                        var release_date = jsonData.first_air_date;
                        var runtimeMinutes = jsonData.episode_run_time + "min";

                        console.log("tv");
                    }

                    if (jsonData.hasOwnProperty('name')) {
                        title = jsonData.name;
                    }
                    else {
                        title = jsonData.original_title;
                    }
                    if (jsonData.poster_path == null) {
                        image = "https://via.placeholder.com/360x500";
                    }
                    else {
                        image += jsonData.poster_path;
                    }
                    if (jsonData.hasOwnProperty("genres")) {
                        for (var i = 0; i < jsonData.genres.length; i++) {
                            if (i == jsonData.genres.length - 1) {
                                genres += `${jsonData.genres[i].name}`;
                            }
                            else {
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
                    movie += "</div>"

                    $("#results").html("");
                    $(".parent").html("");
                    $(".parent1").append(movie);
                }
            });

        } catch (error) {
            console.log(error);
        }

        // $("#results").html("<h2>vidOrPersonContainer ISBN: " + vidOrPersonContainerisbn + "</h2>");
    }


    $("#listLayout").click(function () {
        $("#results").css({ "display": "flex", "flex-direction": "column" });
    });

    $("#gridLayout").click(function () {
        $("#results").css({ "display": "flex", "flex-wrap": "wrap", "flex-direction": "row" });
    });
});