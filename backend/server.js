const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/db'); // We'll create this next

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to accept JSON

// A simple test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use Auth Routes (we will create this soon)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));