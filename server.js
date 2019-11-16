var express     = require("express");
var expressHB   = require("express-handlebars");
var logger      = require("morgan");
var mongoose    = require("mongoose");
var axios       = require("axios");
var cheerio     = require("cheerio");
var db          = require("./models");
var app         = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true })); //this and next line allow us to take api calls/requests from front and parse them 
app.use(express.json());

app.use(express.static("public")); //this allows us to serve up the index.html page and other front-end pages via express


mongoose.connect("mongodb://localhost/ice-scraper", { useNewUrlParser: true });
