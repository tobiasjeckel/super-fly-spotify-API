(function() {
    var nextUrl;
    var timer;
    var link;
    var html;
    var imageUrl = "default.png"; // get a default image

    ///reusable functions
    function createHtml(r) {
        link = "";
        html = "";
        for (var i = 0; i < r.items.length; i++) {
            // images

            if (r.items[i].images[0]) {
                imageUrl = r.items[i].images[0].url;
            }
            //external links
            if (r.items[i].external_urls.spotify) {
                link = r.items[i].external_urls.spotify;
            }
            // html to be pushed into index.html
            html +=
                "<div id = 'result'>" +
                "<a href ='" +
                link +
                "'>" +
                "<img src='" +
                imageUrl +
                "'>" +
                "</a>" +
                "<div id = 'resultText'>" +
                "<a href ='" +
                link +
                "'>" +
                r.items[i].name +
                "</a>" +
                "</div>" +
                "</div>";
        }
        return html;
    }
    ///

    $("#submit-button").on("click", function() {
        clearTimeout(timer);

        if ($("#more").hasClass("on")) {
            $("#more").removeClass("on");
        }

        var userInput = $("input[name='user-input']").val();
        var albumOrArtist = $("select").val();

        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist
            },
            success: function(response) {
                response = response.artists || response.albums;

                //user message
                if (response.items.length > 0) {
                    // console.log(response.items);
                    $("#userMessage").html('Results for: "' + userInput + '"');
                } else {
                    $("#userMessage").html("No results found");
                }

                html = createHtml(response);
                //add all the html from loop to results container
                $("#results-container").html(html);
                //get url for next link
                nextUrl =
                    response.next &&
                    response.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );
                if (response.next) {
                    if (location.search.indexOf("scroll=infinite") > -1) {
                        infiniteCheck();
                    } else {
                        $("#more").addClass("on");
                    }
                }
            }
        });
    });

    //infinite scroll

    function infiniteCheck() {
        var hasReachedBottom =
            $(window).height() + $(document).scrollTop() >=
            $(document).height() - 400;
        if (hasReachedBottom) {
            console.log("hasReachedBottom");
            $.ajax({
                url: nextUrl,
                method: "GET",
                success: function(response) {
                    response = response.artists || response.albums;
                    html = createHtml(response);
                    //add all the html from loop to index.html
                    $("#results-container").append(html);
                    //get url for next link
                    nextUrl =
                        response.next &&
                        response.next.replace(
                            "api.spotify.com/v1/search",
                            "elegant-croissant.glitch.me/spotify"
                        );
                    if (response.next) {
                        infiniteCheck();
                    }
                }
            });
        } else {
            timer = setTimeout(infiniteCheck, 500);
        }
    }
    //end infinite scroll

    //more button
    $("#more").on("click", function() {
        if ($("#more").hasClass("on")) {
            $("#more").removeClass("on");
        }
        console.log("click on more");
        $.ajax({
            url: nextUrl,
            method: "GET",
            success: function(response) {
                response = response.artists || response.albums;
                html = createHtml(response);
                //add all the html from loop to index.html
                $("#results-container").append(html);
                //get url for next link
                nextUrl =
                    response.next &&
                    response.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );
                if (response.next) {
                    $("#more").addClass("on");
                }
            }
        });
    });
})();
