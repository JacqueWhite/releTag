// Controller for our notes
// ========================
var Note = require("../models/Note");

module.exports = {
  get: function(data, cb) {
    // Find all notes with the Article id from the article we passed
    Note.find({
      _ArticleId: data._id
    }, cb);
  },
  // Save a note
  // Export this function as "save" (data = note info, cb = callback)
  save: function(data, cb) {

    // Make a newNote with the note model, saving the apropos info
    var newNote = {
      _ArticleId: data._id,
      dateCreated: Date.now
    };

    // Save the newNote we made to mongoDB with mongoose's save function
    Note.create(newNote, function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Or just log the doc we saved
      else {
        console.log(doc);
        // Place the log back in this callback function
        // so it can be used with other functions asynchronously
        cb(doc);
      }
    });
  },
  delete: function(data, cb) {
    // Remove a Note using mongoose and our note Model,
    // searching by the article's id
    Note.remove({
      _id: data._id
    }, cb);
  }
};
// // All the functions that will do the routing for the app,
// //and the logic of each route.
// var express = require('express');
// var router = express.Router();
// var mongoose = require("mongoose");

// // The scraping tools
// var request = require("request");
// var cheerio = require("cheerio");

// // Mongoose mpromise deprecated - use bluebird promises
// var Promise = require("bluebird");
// mongoose.Promise = Promise;

// // Requiring the Note and Article models
// var Note = require("../models/Note.js");
// var Article = require("../models/Article.js");

// //Database configuration with mongoose
// var dbURI = 'mongodb://localhost/reletag';

// if (process.env.NODE_ENV === 'production') {
//     dbURI = "mongodb://heroku_6czmbhr2:ebgdl01q3vmhgki8052758lr7o@ds161584.mlab.com:61584/heroku_6czmbhr2";
// }

// // Database configuration with mongoose
// mongoose.connect(dbURI);
// var db = mongoose.connection;

// // Show any mongoose errors
// db.on("error", function(error) {
//     console.log("Mongoose Error: ", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function() {
//     console.log("Mongoose connection successful.");
// });

// //root route redirect to /index
// router.get('/', function(req, res) {
//     res.redirect('/index');
// });

// router.get('/index', function(req, res) {
//     res.render("index");
// });

// router.get("articles/:id", function(req, res) {
//   console.log(req.params.eventId);
//   Article.findOne({ "_id": req.params.id }).then(function(articleData) {
//     if (articleData) {
//       res.render("article", articleData);
//     } else {
//       res.send("Nuthin here.")
//     }
//   })
// });

// // A GET request to scrape the website
// router.get("/scrape", function(req, res) {
//     // First, we grab the body of the html with request
//     request("http://www.bbc.com/news", function(error, response, html) {
//         // Then, we load that into cheerio and save it to $ for a shorthand selector
//         var $ = cheerio.load(html);
//         $("div.gs-c-promo-body").each(function(i, element) {

//                 // Save an empty result object
//                 var result = {};

//                 // Add the text and href of every link, and save them as properties of the result object - var result.title = $(element).children().text(); OR
//                 result.title = $(this).find("h3").text();
//                 // // var result.link = $(element).children().attr("href"); OR
//                 result.link = $(this).find("a").attr("href");

//                 if (result.link.slice(0,4) != "http") {
//                   result.link = "http://www.bbc.com" + result.link
//                 }
//                 // ES6 way to do it...
//                 // if (!result.link.startsWith("http")) {
//                 //   result.link = "http://www.bbc.com/news" + result.link
//                 // } 

//                 // Using our Article model, create a new entry, passing the result object to the entry (the title and link)
//                 var entry = new Article(result);

//                 // Now, save that entry to the db
//                 entry.save(function(err, doc) {
//                     // Log any errors
//                     if (err) {
//                         console.log(err);
//                     }
//                     // Or log the doc
//                     else {
//                         console.log(doc);
//                     }
//                 });
//             });
//         });
//     res.json();
//     });

// // This will get the articles we scraped from the mongoDB
// router.get("/articles", function(req, res) {
//     // Grab every doc in the Articles array
//     Article.find({}, function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Or send the doc to the browser as a json object
//         else {
//             res.json(doc);
//         }
//     });
// });

// // Grab an article by it's ObjectId
// // router.get("articles/:id?", function(req, res) {
// //   console.log(req.params.id)
// //     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
// //     Article.find({ "_id": req.params.id })
// //         // ..and populate all of the notes associated with it
// //         // now, execute our query
// //         .exec(function(error, doc) {
// //             // Log any errors
// //             if (error) {
// //                 console.log(error);
// //             }
// //             // Otherwise, send the doc to the browser as a json object
// //             else {
// //                 res.json(doc);
// //             }
// //         });
// // });

// // Grab an article by it's ObjectId
// router.get("/articles/:id?", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     Article.findOne({ "_id": req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("note")
//         // now, execute our query
//         .exec(function(error, doc) {
//             // Log any errors
//             if (error) {
//                 console.log(error);
//             }
//             // Otherwise, send the doc to the browser as a json object
//             else {
//                 // res.json(doc);
//                 res.render("article", doc);
//             }
//         });
// });

// // Create a new note or replace an existing note
// router.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     var newNote = new Note(req.body);

//     // And save the new note the db
//     newNote.save(function(error, doc) {
//         // Log any errors
//         if (error) {
//             console.log(error);
//         }
//         // Otherwise
//         else {
//             // Use the article id to find and update it's note
//             Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
//                 // Execute the above query
//                 .exec(function(err, doc) {
//                     // Log any errors
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         // Or send the document to the browser
//                         res.send(doc);
//                     }
//                 });
//         }
//     });
// });

// module.exports = router;