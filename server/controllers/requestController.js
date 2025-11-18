const Request = require("../models/Request");
const Book = require("../models/Book");
const Loan = require("../models/Loan");

exports.createRequest = async (req, res) => {
  try {
    const { bookId, student } = req.body;

    if (!bookId || !student) {
      return res.status(400).json({ message: "Book ID and student name are required" });
    }

    // Find book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.available <= 0) {
      return res.status(400).json({ message: "Book is not available" });
    }

    // Create request with book title fetched here
    const newRequest = new Request({
      bookId,
      bookTitle: book.title,
      student,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    });

    await newRequest.save();

    return res.status(201).json({ message: "Borrow request created successfully" });

  } catch (error) {
    console.error("Error in createRequest:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    console.error("Error in getRequests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const book = await Book.findById(request.bookId);
    if (!book || book.available <= 0)
      return res.status(400).json({ message: "Book not available" });

    book.available -= 1;
    await book.save();

    const borrowed = new Date();
    const due = new Date(borrowed.getTime() + 15 * 24 * 60 * 60 * 1000);

    const loan = new Loan({
      bookId: book._id,
      bookTitle: book.title,
      student: request.student,
      borrowed: borrowed.toISOString().slice(0, 10),
      due: due.toISOString().slice(0, 10),
      returned: null,
      penalty: 0,
    });

    await loan.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "Request approved and loan created" });

  } catch (error) {
    console.error("Error in approveRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.denyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "denied";
    await request.save();

    res.json({ message: "Request denied" });

  } catch (error) {
    console.error("Error in denyRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};
