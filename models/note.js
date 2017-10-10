// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
  // Just a string
  _ArticleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  rating: {
    type: Number,
    required: true
  },
  // Just a string
  tag1: {
    type: String,
    required: true
  },
  tag2: {
    type: String,
    required: true
  },
  tag3: {
    type: String,
    required: true
  },
  submitDate: Date
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;