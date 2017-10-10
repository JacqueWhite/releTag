// Server routes
// =============

// Bring in the Scrape function from our scripts directory
var scrape = require("../scripts/scrape");

var express = require('express')

var router = express.Router()

// Bring Articles and notes from the controller
var articlecontroller = require("../controllers/articlecontroller.js");
var notecontroller = require("../controllers/notecontroller.js");

// This route renders the homepage
router.get("/", function(req, res) {
  res.render("home");
});

// This route renders the saved handledbars page
router.get("/saved", function(req, res) {
  res.render("saved");
});

// This route handles scraping more articles to add to our db
router.get("/api/fetch", function(req, res) {


  articlecontroller.fetch(function(err, docs) {

    if (!docs || docs.insertedCount === 0) {
      res.json({
        message: "No new articles today. Visit <a href='/api/fetch'>the Scraper</a>to get articles"
      });
    }
    // Otherwise send back a count of how many new articles we got
    else {
      res.json({
        message: "Added " + docs.insertedCount + " new articles!"
      });
    }
  });
});

// This route handles getting all Articles from our database
router.get("/api/Articles", function(req, res) {

  var query = {};
  if (req.query.saved) {
    query = req.query;
  }


  articlecontroller.get(query, function(data) {
    // Send the article data back as JSON
    res.json(data);
  });
});

// This route handles deleting a specified Article
router.delete("/api/Articles/:id", function(req, res) {
  var query = {};
  // Set the _id property of the query object to the id in req.params
  query._id = req.params.id;

  // Run the ArticlesController delete method and pass in our query object containing
  // the id of the Article we want to delete
  articlecontroller.delete(query, function(err, data) {
    // Send the result back as JSON to be handled client side
    res.json(data);
  });
});

// This route handles updating a Article, in particular saving one
router.patch("/api/Articles", function(req, res) {


  articlecontroller.update(req.body, function(err, data) {
    // After completion, send the result back to the user
    res.json(data);
  });
});

// This route handles getting notes for a particular Article id
router.get("/api/notes/:Article_id?", function(req, res) {

  var query = {};
  if (req.params.Article_id) {
    query._id = req.params.Article_id;
  }

  // Get all notes that match our query using the notesController get method
  notecontroller.get(query, function(err, data) {

    // Send the note data back to the user as JSON
    res.json(data);
  });
});

// This route handles deleting a note of a particular note id
router.delete("/api/notes/:id", function(req, res) {
  var query = {};
  query._id = req.params.id;


  notecontroller.delete(query, function(err, data) {
    // Send the article data to a json
    res.json(data);
  });
});

// This route handles saving a new note
router.post("/api/notes", function(req, res) {
  notecontroller.save(req.body, function(data) {
    // Send the note to the browser as a json
    res.json(data);
  });
});

module.exports = router
