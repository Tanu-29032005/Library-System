const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  bookId: String,
  bookTitle: String,
  student: String,
  borrowed: String,
  due: String,
  returned: String,
  penalty: Number
});

module.exports = mongoose.model("Loan", loanSchema);
