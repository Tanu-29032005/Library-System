const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Add a new book
router.post("/add", bookController.addBook);

// Get all books
router.get("/", bookController.getBooks);

// Update book
router.put("/:id", bookController.updateBook);

// Delete book
router.delete("/:id", bookController.deleteBook);

module.exports = router;
