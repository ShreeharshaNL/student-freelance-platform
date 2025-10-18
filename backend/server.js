const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { testConnection, initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const studentProfileRoutes = require('./routes/StudentProfileRoutes');

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
app.use('/api/auth', authRoutes);
app.use('/api/student-profile', studentProfileRoutes);

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Test database connection and start server
const startServer = async () => {
  try {
    // Initialize database with schema
    await initializeDatabase();
    console.log('✅ Database schema initialized');
    
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
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
