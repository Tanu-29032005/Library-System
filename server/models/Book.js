const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  genre: String,
  copies: Number,
  available: Number
});

module.exports = mongoose.model("Book", bookSchema);
