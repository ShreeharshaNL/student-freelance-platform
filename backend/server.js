//server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));
app.use('/api/projects', require('./routes/projectRoutes'));

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// JWT auth for sockets
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("No auth token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid auth token"));
  }
});

// Socket handlers
io.on("connection", (socket) => {
  // Join/leave conversation rooms
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) socket.join(conversationId.toString());
  });
  socket.on("leave_conversation", (conversationId) => {
    if (conversationId) socket.leave(conversationId.toString());
  });
});

// Make io available in routes/controllers
app.set("io", io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running with Socket.IO on port ${PORT}`);
});
