// Controller for article
// ============================
// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");

// Bring in the Article and Note mongoose models
var Article = require("../models/Article");

module.exports = {
  fetch: function(cb) {

    // Run scrape function
    scrape(function(data) {
      // Here data is an array of article objects with headlines and summaries
      // Setting this to articles for clarity
      var scrapedArticles = data;
      // Make sure each article object has a date and is not saved by default
      for (var i = 0; i < scrapedArticles.length; i++) {
        scrapedArticles[i].saved = false;
      }

      Article.collection.insertMany(scrapedArticles, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Article.remove(query, cb);
  },
  get: function(query, cb) {

    Article.find(query)
      .sort({
        _id: -1
      })
      // Execute this query
      .exec(function(err, doc) {
        // Once finished, pass the list into the callback function
        cb(doc);
      });
  },
  update: function(query, cb) {
    
    Article.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};

