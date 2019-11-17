$.ajax({
    method: "GET",
    url: "/api/all/articles/"
}).then(data => {
    data.forEach(element => {
        $("#articles").prepend("<div data-id='" + element._id + "' class='article'><li class='list-group-item' data-id='" + element._id + "'>" + element.title + "</li><div class='card-body'><button class='btn btn-outline-danger delete text-right' data-id='"+ element._id +"'>Delete</button> <a class='float-right link btn btn-outline-primary' target='_blank' href='"+ checkUrl(element) + "'>View Source</a></div></div>");
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

$(document).on("click", ".delete", function() {
    var id = $(this).attr('data-id'); //when using $(this), you cant use arrow function
    console.log(id);
    $.ajax({
        method: "DELETE",
        url: "/api/article/" + id
    }).then(data => {
        location.reload();
    });
});

//$(document).on("click", ".article", function() {
    /*
    * TODO:
    * on click of this div, show the notes modal (or something) and set the data-id to the id from that article
    */
//});

function checkUrl (url) {
   var split = (url.link).split("//");
   if (split[0] === "https:") {
        return url.link
   }
   else {
       return "https://old.reddit.com" + (url.link).toString(); //need to convert to string otherwise it will be string + object and url wont work
   }
}

/*
put the below code inside of a button click (for when user clicks submit on that note)
var id = $(this).data('id'); //var id = $(this).attr("data-id");
$.ajax({
    method: "POST",
    url: "/api/articleNote/:id" + id
}).then(data => {
    location.reload();
})
*/