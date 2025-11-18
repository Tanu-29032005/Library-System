const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());


// DB
connectDB();
// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));

app.listen(3000, () => console.log("Server running on port 3000"));
