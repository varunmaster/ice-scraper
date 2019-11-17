$.ajax({
    method: "GET",
    url: "/api/all/articles/"
}).then(data => {
    data.forEach(element => {
        $("#articles").prepend("<div data-id='" + element._id + "'><p data-id='" + element._id + "' href='" + element.link + "'>" + element.title + "</p>");
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
