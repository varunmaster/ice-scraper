$.ajax({
    method: "GET",
    url: "/api/all/articles/"
}).then(data => {
    data.forEach(element => {
        $("#articles").prepend("<div data-id='" + element._id + "'><p data-id='" + element._id + "'>" + element.title + "</p><button class='btn btn-outline-danger delete text-right' data-id='"+ element._id +"'>Delete</button> <a class='float-right link btn btn-outline-primary' target='_blank' href='"+ element.link + "'>View Source</a></div>");
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
