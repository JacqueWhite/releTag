// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  // _id: {
  //   type: Schema.Types.ObjectId
  // },
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  date: String,
  saved: {
    type: Boolean,
    default: false
  },
  source: String,
  category: String,
  catLink: String

});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
