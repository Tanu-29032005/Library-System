const Loan = require("../models/Loan");
const Book = require("../models/Book");

exports.getLoans = async (req, res) => {
  const loans = await Loan.find();
  res.json(loans);
};

exports.returnBook = async (req, res) => {
  const { id } = req.params;

  const loan = await Loan.findById(id);
  if (!loan) return res.status(404).json({ message: "Loan not found" });

  // calculate penalty
  const today = new Date();
  const dueDate = new Date(loan.due);

  let penalty = 0;
  if (today > dueDate) {
    const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    penalty = daysLate * 30;
  }

  loan.returned = today.toISOString().slice(0, 10);
  loan.penalty = penalty;
  await loan.save();

  // increase book availability
  const book = await Book.findById(loan.bookId);
  if (book) {
    book.available += 1;
    await book.save();
  }

  res.json({ message: "Book returned", penalty });
};
