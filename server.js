var express     = require("express");
var expressHB   = require("express-handlebars");
var logger      = require("morgan");
var mongoose    = require("mongoose");
var axios       = require("axios");
var cheerio     = require("cheerio");
var db          = require("./models");
var app         = express();

app.set("views", "./views");
app.engine("handlebars", expressHB({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true })); //this and next line allow us to take api calls/requests from front and parse them 
app.use(express.json());
app.use(express.static("public")); //this allows us to serve up the index.html page and other front-end pages via express

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ice-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) {
    db.Article.find({})
        .then(dbUser => {
            return res.render("index");
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});

app.get("/scrape", (req, res) => {
    axios.get("https://old.reddit.com/r/Delightfullychubby/").then((page) => {
        var $ = cheerio.load(page.data); //all of the html (tags included) get saved in here
        //console.log($);
        $("p.title").each(function (i, element) { //must use word function, arrow function is no bueno --> THAT IS SO DUMB SPENT LIKE 20 MINS DEBUGGING BC OF THIS
            //console.log(element); //this is interesting, should take a look at this later
            var result = {};

            result.title = $(this).children("a.title").text();

            result.link = $(this).children("a").attr("href");

            // console.log(result);
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.status(500).json(err);
                });
        });
        res.redirect("/");
    });
});

app.get("/api/all/articles/", (req, res) => {
    db.Article.find({}).sort({"_id": -1})
        .then(data => {
            return res.json(data);
        }).catch(err => {
            return res.status(500).json(err);
        });
});

app.get("/api/article/:id", (req, res) => {
    var id = req.params.id;
    db.Article.findOne({
        "_id": id
    }).then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(500).json(err);
    });
});

app.get("/api/articleNote/:id", (req, res) => { 
    var id = req.params.id;
    db.Article.findOne({"_id": id})
    .populate("note") //populate is like a join and will send the collection of note as well
    .then(data => {
      return res.json(data);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

app.post("/api/articleNote/:id", (req, res) => { 
    db.Note.create(req.body).then(dbNote => {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true }); //adding the association (foreign key) to article collection
    }).then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(500).json(err);
    })
});

app.delete("/api/all/articles", (req, res) => {
    db.Article.deleteMany({}).then(data => {
        db.Note.deleteMany({}).then(data => {
            console.log("deleted all notes");
        }); //want to empty out notes collection as well
    }).then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(500).json(err);
    });
});

app.delete("/api/article/:id", (req, res) => {
    var id = req.params.id;
    console.log(id);
    db.Article.deleteOne({
        "_id": id
    }).then(data => {
        return res.json(data)
    }).catch(err => {
        return res.status(500).json(err);
    });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
