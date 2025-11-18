const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Student Registration
router.post("/register", studentController.registerStudent);

// Student Login
router.post("/login", studentController.studentLogin);

// Get all students (Admin-only ideally)
router.get("/all", studentController.getAllStudents);

module.exports = router;
