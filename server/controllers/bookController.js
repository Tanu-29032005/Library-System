const Book = require("../models/Book");

exports.addBook = async (req, res) => {
  const { title, author, isbn, genre, copies } = req.body;

  const newBook = new Book({
    title,
    author,
    isbn,
    genre,
    copies,
    available: copies
  });

  await newBook.save();
  res.json({ message: "Book added successfully" });
};

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  await Book.findByIdAndUpdate(id, updated);
  res.json({ message: "Book updated" });
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  await Book.findByIdAndDelete(id);
  res.json({ message: "Book deleted" });
};
