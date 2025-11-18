const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

// Get all loans
router.get("/", loanController.getLoans);

// Return book
router.put("/return/:id", loanController.returnBook);

module.exports = router;
