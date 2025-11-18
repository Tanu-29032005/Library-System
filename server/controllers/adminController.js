const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // create token
    const token = jwt.sign({ id: admin._id }, "librarysecret", { expiresIn: "7d" });

    res.json({
      message: "Admin login success",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all students (Admin function)
exports.getAllStudents = async (req, res) => {
  try {
    const Student = require("../models/Student");
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error loading students" });
  }
};
