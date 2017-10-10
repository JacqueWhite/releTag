/* global bootbox */
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");

  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  // initPage kicks everything off when the page is loaded
  initPage();

  function initPage() {
    // Empty the article container, run an AJAX request for any saved articles
    articleContainer.empty();
    $.get("/api/articles?saved=true").then(function(data) {
      // If we have articles, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaing we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
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
    var newDate = article.date.toDateString();
    var panel =
      $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<a target='_blank' href='" + article.link + "''>" + article.title + "</a>",
        "<a class='btn btn-danger delete'>",
        "Delete ",
        "</a>",
        "<a class='btn btn-info notes'>Notes</a>",
        "</div>",
        "<div class='panel-body'>",
        "<ul>",
        "<li><h5>" + article.summary + "</h5></li>",
        "<li><p>"+ newDate + "</p></li>",
        "<li><a target='_blank' href='" + article.catLink + "''>" + article.category + "</a></li>",
        "</ul>",
        "</div>",
        "</div>"
      ].join(""));
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert =
      $(["<div class='alert alert-warning text-center'>",
        "<h4>No saved Articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {

    var notesToRender = [];
    var currentNote;
    if (!data.note.length) {
      // If we have no notes, just display a message explaing this
      currentNote = [
        "<li class='list-group-item'>",
        "No entries for this article yet. Be the first.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    }
    else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.note.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
        currentNote = $([
          "<li class='list-group-item note'>",
          data.note[i].rating,
          "Tags added: " + data.note[i].tag1 + data.note[i].tag2 + data.note[i].tag3,
          data.note[i].sumbitDate,
          "<button class='btn btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.note[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // This function handles deleting articles/articles
    // We grab the id of the article to delete from the panel element the delete button sits inside
    var articleToDelete = $(this).parents(".panel").data();
    // Using a delete method here just to be semantic since we are deleting an article/article
    $.ajax({
      method: "DELETE",
      url: "/api/articles/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will rerender our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    // This function handles opending the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the panel element the delete button sits inside
    var currentArticle = $(this).parents(".panel").data();
    // Grab any notes with this article/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Constructing our initial HTML to add to the notes modal
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {

    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();

    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    // This function handles the deletion of notes
    // We stored this data on the delete button when we created it
    var noteToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

});