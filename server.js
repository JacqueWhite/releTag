// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

// Instantiate our Express App
var app = express();

// Set up an Express Router

// Require our routes file pass our router object
var router = require("./config/routes");

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParser in our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Have every request go through our router middleware
app.use(router);

var Promise = require("bluebird");
mongoose.Promise = Promise;
// If deployed, use the deployed database. Otherwise use the local database
var db = process.env.MONGODB_URI || "mongodb://localhost/reletag";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});