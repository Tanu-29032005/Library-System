const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb+srv://tanu_120:tanu120@cluster0.gsszltt.mongodb.net/?appName=Cluster0")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const Admin = require("./models/Admin");

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  await Admin.create({
    username: "admin",
    email: "admin@gmail.com",
    password: hashed,
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();
