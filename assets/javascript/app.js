var animals = ["Favorites", "Cat", "Shark", "Whale", "Panda", "Bear", "Giraffe"];
var favorites = [];
// ratings G/PG/PG-13/R

// make buttons for every animal
function makeBtns() {
    $("#btnSpam").empty();
    for (var i = 0; i < animals.length; i++) {

        var animalBtn = $("<button>").attr("class", "btn btn-info m-3");
        animalBtn.addClass("letter-button letter letter-button-color");
        animalBtn.attr({
            "data-animal": animals[i],
            "onclick": "btnAnimal()",
        });
        animalBtn.text(animals[i]);

        if (i == 0) {
            animalBtn.attr("id", "favBtn");
        }

        $("#btnSpam").append(animalBtn);
    }
};

// if enter is pressed in the input field act as if it was submitted
var userInput = document.getElementById("get-animal");
userInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("animal-submit").click();
    }
});


// when animal button is clicked populate still-gifs
function gimmeGifs(animal) {


    if (animal == "Favorites") {
        $("#gifSpam").empty();

        for (var index = 0; index < favorites.length; index++) {
            $("#gifSpam").prepend(favorites[index]);
        }

        return
    }
    $("#gifSpam").empty();

    var queryItem = animal;
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + queryItem + "&api_key=dAY3n2gyWacdsBSXbo3lp44fHPJeSRcN&limit=10&rating=PG-13";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        for (var i = 0; i < response.data.length; i++) {

            var imgSpam = $("<img>");

            imgSpam.addClass("imgs");
            imgSpam.attr({
                "src": response.data[i].images.original_still.url,
                "data-state": "still",
                "data-still-url": response.data[i].images.original_still.url,
                "data-gif-url": response.data[i].images.original.url,
                "onclick": "stateTrans()",
            });

            var divBox = $("<div>").addClass(animal + "-" + i + "div");
            divBox.addClass("divBox");
            var newnew = $("<p>").text("Rating : " + response.data[i].rating);
            newnew.addClass("rating");
            divBox.append(newnew);
            divBox.append(imgSpam);
            var likeBefore = false;
            for (let index = 0; index < favorites.length; index++) {
                if (favorites[index][0].childNodes[2].className == (animal + "-" + i)) {
                    var heart = $("<button>").attr({
                        "id": "heartBtn",
                        "onclick": "addToFav()",
                        "data-liked": "yes"
                    }).html("<i class='fas fa-heart' onclick='addToFav()' data-liked='child'></i>"); // fas fa-heart for solid
                    heart.addClass(animal + "-" + i);
                    divBox.append(heart);
                    likeBefore = true;
                }
            }
            if (likeBefore == false) {
                var heart = $("<button>").attr({
                    "id": "heartBtn",
                    "onclick": "addToFav()",
                    "data-liked": "no"
                }).html("<i class='far fa-heart' onclick='addToFav()' data-liked='child'></i>"); // fas fa-heart for solid
                heart.addClass(animal + "-" + i);
                divBox.append(heart);
            }
            $("#gifSpam").prepend(divBox);

        }

    });

};

// add the new animal from the users input
function usersAnimal() {
    $("#error").empty();

    var userAnimal = $("#get-animal").val().trim();
    $("#get-animal").val("");
    var lowerAnimals = [];
    for (var index = 0; index < animals.length; index++) {

        lowerAnimals.push(animals[index].toLowerCase());

    }


    $.ajax({
        url: "http://api.giphy.com/v1/gifs/search?q=" + userAnimal + "&api_key=dAY3n2gyWacdsBSXbo3lp44fHPJeSRcN&limit=10&rating=PG-13",
        method: "GET"
    }).then(function (response) {
        if (userAnimal != "" && !lowerAnimals.includes(userAnimal.toLowerCase()) && response.data.length != 0) {
            animals.push(userAnimal);
            makeBtns();
        } else if (response.data.length == 0) {
            $("#error").text("That animal didn't pull up any results!")
        } else {
            $("#error").text("That animal already is available!")
        }
    });


}

//grab the animal name for the button and give it to gimmeGifs
function btnAnimal() {
    $("#error").empty();
    var defaultBtnAnimal = event.target.getAttribute("data-animal")
    gimmeGifs(defaultBtnAnimal);
}

//make still images turn into gifs and vise versa
function stateTrans() {
    $("#error").empty();
    var currentState = event.target.getAttribute("data-state");
    var currentStillUrl = event.target.getAttribute("data-still-url");
    var currentGifUrl = event.target.getAttribute("data-gif-url");

    if (currentState == "still") {
        $(event.target).attr({
            "data-state": "gifMode",
            "src": currentGifUrl,
        });
    } else {
        $(event.target).attr({
            "data-state": "still",
            "src": currentStillUrl,
        });
    }
}


// add favs
function addToFav() {


    if (event.target.tagName == "I") {
        var button = $(event.target).parent();
    } else {
        var button = event.target;
    }


    if ($(button).attr("data-liked") == "no") {
        $(button).attr({
            "data-liked": "yes",
        });
        $(button).html(("<i class='fas fa-heart'></i>"));

        for (let index = 0; index < favorites.length; index++) {
            if ($(button).attr("class") == favorites[index][0].childNodes[2].className) {
                favorites = favorites.splice(index, 1);

            }

        }

        favorites.push($(button).parent());
    } else if ($(button).attr("data-liked") == "yes") {
        $(button).attr({
            "data-liked": "no",
        });
        $(button).html(("<i class='far fa-heart'></i>"));
        if (favorites.length == 1) {

            favorites = [];
        } else {
            for (let index = 0; index < favorites.length; index++) {

                if ($(button).attr("class") == favorites[index][0].childNodes[2].className) {
                    favorites.splice(index, 1);
                }

            }
        }

    }




}


//initial run to make the default animals appear

$(document).ready( function(){
makeBtns();
});

// TODO: below-
// add favorites to the main array. assign it an id to be used for running it and coloring it red
// create a button on each gif div that toggles on or off for favorites
// if toggle is on push it into a new array.
// when favoites is clicked have it run the gimme gifs but have an if seeing if favorites was clicked then return out after.

/* # GifTastic

my giphy API key below -
dAY3n2gyWacdsBSXbo3lp44fHPJeSRcN

![GIPHY](Images/1-giphy.jpg)

[Giphy API](https://developers.giphy.com/docs/).

2. **[Watch the demo video](https://youtu.be/BqreERTLjgQ)**

### Instructions - bonus

2. Allow users to request additional gifs to be added to the page.
   * Each request should ADD 10 gifs to the page, NOT overwrite the existing gifs.

   ### Create a README.md

Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`. Here are some resources to help you along the way:

* [About READMEs](https://help.github.com/articles/about-readmes/)

* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/) */