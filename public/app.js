$.ajax({
    method: "GET",
    url: "/api/all/articles/"
}).then(data => {
    data.forEach(element => {
        $("#articles").prepend("<div data-id='" + element._id + "' class='article'><li class='list-group-item' data-id='" + element._id + "'>" + element.title + "</li><div class='card-body'><button class='btn btn-outline-danger delete text-right' data-id='" + element._id + "'>Delete</button> <a class='float-right link btn btn-outline-primary' target='_blank' href='" + checkUrl(element) + "'>View Source</a></div></div>");
    });
});

$(document).on("click", "#clear-button", () => {
    $.ajax({
        method: "DELETE",
        url: "/api/all/articles"
    }).then(data => {
        location.reload();
    });
});

$(document).on("click", ".delete", function () {
    var id = $(this).attr('data-id'); //when using $(this), you cant use arrow function
    console.log(id);
    $.ajax({
        method: "DELETE",
        url: "/api/article/" + id
    }).then(data => {
        location.reload();
    });
});

$(document).on("click", ".article", function () {
    $(".note").empty();
    var id = $(this).data("id"); //this is to get the id of the article that is clicked on
    console.log(id);
    $.ajax({
        method: "GET",
        url: "/api/article/" + id
    }).then(function (data) {
        // put data.title in the card-body
        // console.log(data);
        $(".note").append("<p class='card-text'>" + data.title + "</p>");
        $(".note").append("<form><div class='form-group'><label for='exampleInputText'>Title</label><input type='text' class='form-control' id='noteTitle' placeholder='Note Title'></div><div class='form-group'><label for='exampleFormControlTextarea1'>Body</label><textarea class='form-control' id='noteBody' rows='3' placeholder='Body'></textarea></div><button type='submit' class='btn btn-primary text-cener' id='note-submitBtn' data-id='" + data._id + "'>Submit</button></form>");
    });
});

$(document).on("click", "#note-submitBtn", function (e) {
    e.preventDefault();
    var id = $(this).data("id");
    console.log(id);
    $.ajax({
        method: "POST", //made this route on server.js
        url: "/api/articleNote/" + id
    }).then(data => {
        location.reload();
    });
});

function checkUrl(url) {
    var split = (url.link).split("//");
    if (split[0] === "https:") {
        return url.link
    }
    else {
        return "https://old.reddit.com" + (url.link).toString(); //need to convert to string otherwise it will be string + object and url wont work
    }
}
