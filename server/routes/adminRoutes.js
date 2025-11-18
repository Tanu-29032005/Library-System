const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin Login
router.post("/login", adminController.loginAdmin);

// Get all students for admin dashboard
router.get("/students", adminController.getAllStudents);

module.exports = router;
