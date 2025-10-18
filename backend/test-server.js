const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Backend running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});
