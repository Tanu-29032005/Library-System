const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerStudent = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await Student.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);

  const newStudent = new Student({
    username,
    email,
    password: hashed
  });

  await newStudent.save();

  res.json({ message: "Student registered successfully" });
};


exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) return res.status(400).json({ message: "Student not found" });

  const match = await bcrypt.compare(password, student.password);
  if (!match) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ email, role: "student" }, "secretkey", { expiresIn: "1d" });

  res.json({ message: "Login successful", token, username: student.username });
};


exports.getAllStudents = async (req, res) => {
  const students = await Student.find({}, "-password"); // remove password
  res.json(students);
};
