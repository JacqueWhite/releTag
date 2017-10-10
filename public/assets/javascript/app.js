/* gloabl bootbox */
$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  // Once the page is ready, run the initPage function to kick things off
  initPage();

  function initPage() {
    // Empty the article container, run an AJAX request for any unsaved articles
    articleContainer.empty();
    $.get("/api/articles?saved=false")
      .then(function(data) {
        // If we have articles, render them to the page
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          // Otherwise render a message explaing we have no articles
          renderEmpty();
        }
      });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articlePanels = [];
    // We pass each article JSON object to the createPanel function which returns a bootstrap
    // panel with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array,
    // append them to the articlePanels container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // This functiont takes in a single JSON object for an article/article
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article panel
    var panel =
      $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.title,
        "<a class='btn btn-default save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join(""));
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to save
    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert =
      $(["<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attatched a javascript object containing the article id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PATCH",
      url: "/api/articles",
      data: articleToSave
    })
    .then(function(data) {
      // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
      // (which casts to 'true')
      if (data.ok) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/fetch")
      .then(function(data) {
        // If we are able to succesfully scrape the NYTIMES and compare the articles to those
        // already in our collection, re render the articles on the page
        // and let the user know how many unique articles we were able to save
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
  }
});
/////////
// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//           $("#articles").append(
//    `
//     <h5 data-id="${data[i]._id}">${data[i].title}</h5>
//     <a data-id="data[i]._id" href="${data[i].link}" target="about_blank">${data[i].link}</a>
//         <a href="/article/${data[i]._id}" target="about_blank">See what others think</a>
//     `);
//           console.log('\n\nappending OG articles to page');
//     }

//         $("#article-info").append(
//           `
//           <h3 class="text-center rowText">"${data.title}"</h3>
//           <div id="articles">
//           <a data-id="data._id" href="${data.link}" target="about_blank">${data.link}</a>

//           <h4 class="text-center smallText">Readers say:</h4>
//           <h5>Rating: ${data.rating}</h5>
//           <h4>Top Hashtags</h4>
//           <p># ${data.tag1input}</h5>
//           <p># ${data.tag2input}</p>
//           <p># ${data.tag3input}</p>
//       `)

//       if (data.note) {
//         $("#note-info").append(
//           `
//                 <h5>Rating: ${data.rating}</h5>
//                 <h4>Top Hashtags</h4>
//                 <p># ${data.tag1input}</h5>
//                 <p># ${data.tag2input}</p>
//                 <p># ${data.tag3input}</p>
//             `)
//       } else {
//         $("#note-info").append(
//           `
//             <p>Give the Article a Bias Rating: 4 being unbiased.</p>
//             <select id='rating' name="rating">
//             <option value="1">1 totally unbiased</option> 
//             <option value="2">2 somewhat unbiased</option>
//             <option value="3">3 somewhat biased</option> 
//             <option value="4">4 totally biased</option>
//             </select>
//             <p>Enter in the top 3 relevant hashtags/keywords for this article</p>
//             <input id='tag1input' name='tag1'></input>
//             <input id='tag2input' name='tag2'></input>
//             <input id='tag3input' name='tag3'></input>
//             <button data-id='${data.rating}' id='savenote'>Save Note</button>
//             `)
//       }
// console.log('\n\nappending YAS to page');

//   });

// // Whenever someone clicks a p tag
// $(document).on("click", "h5", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .done(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<p class='title'>" + data.title + "</p>");
//       // An input to enter a new title
//       $("#notes").append(`
// <p>Give the Article a Bias Rating: 4 being unbiased.</p>
// <select id='rating' name="rating">
//   <option value="1">1 totally unbiased</option> 
//   <option value="2">2 somewhat unbiased</option>
//   <option value="3">3 somewhat biased</option> 
//   <option value="4">4 totally biased</option>
// </select>`);

// //tag1
//       // A textarea to add a new note body
//       $("#notes").append(`
//         <p>Enter in the top 3 relevant 
//         hashtags/keywords for this article!
//         </p>
//         <input id='tag1input' name='tag1'></input>`);
// //tag2
//       $("#notes").append(`<input id='tag2input' name='tag2'></input>`);
// //tag3
//       $("#notes").append(`<input id='tag3input' name='tag3'></input>`);

//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#rating").val(data.note.rating);
//         // Place the body of the note in the body textarea
//         $("#tag1input").val(data.note.tag1);
//         $("#tag2input").val(data.note.tag2);
//         $("#tag3input").val(data.note.tag3); 
//       }
//     });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       // title: $("#titleinput").val(),
//       // Value taken from note textarea
//       rating: $("#rating").val(),
//       tag1: $("#tag1input").val(),
//       tag2: $("#tag2input").val(),
//       tag3: $("#tag3input").val()
//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   // $("#titleinput").val("");
//       $("#rating").empty();
//       $("#tag1input").empty();
//       $("#tag2input").empty();
//       $("#tag3input").empty();
// });

