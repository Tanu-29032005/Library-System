const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tanu_120:tanu120@cluster0.gsszltt.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
