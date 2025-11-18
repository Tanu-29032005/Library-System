const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  student: { type: String, required: true },
  status: { type: String, default: "pending" },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Request", requestSchema);
