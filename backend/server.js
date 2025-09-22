const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("Backend running 🚀"));
app.use('/api/auth', authRoutes);

// Test database connection and start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('Failed to connect to database. Server not started.');
    process.exit(1);
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
  });
};

startServer();
