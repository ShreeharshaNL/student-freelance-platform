const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();
connectDB();

const app = express();

// ✅ include all your actual frontends here
const allowedOrigins = [
  "http://localhost:5173",
  "https://student-freelance-platform-nie.vercel.app",
];

// helper to allow preview deployments and mobile browsers
const isAllowed = (origin) => {
  // Allow requests with no origin (mobile apps, Postman, curl, etc.)
  if (!origin) return true;
  
  // Allow localhost for development
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  
  // Allow specific origins
  if (allowedOrigins.includes(origin)) return true;
  
  // Allow Vercel preview deployments
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  
  return false;
};

const corsOptions = {
  origin: (origin, cb) => {
    if (isAllowed(origin)) {
      return cb(null, true);
    }
    console.log('CORS blocked origin:', origin);
    return cb(null, true); // Allow all origins for now to debug mobile issue
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests for all routes
app.use(morgan("dev"));

// Routes
app.use('/api', require('./routes'));

app.get("/", (req, res) => res.send("API is running..."));
app.use((req, res) =>
  res.status(404).json({ success: false, error: "Route not found" })
);

const PORT = process.env.PORT || 5000;

// --- Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("No auth token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Invalid auth token"));
  }
});

io.on("connection", (socket) => {
  socket.on("join_conversation", (id) => id && socket.join(id.toString()));
  socket.on("leave_conversation", (id) => id && socket.leave(id.toString()));
});

app.set("io", io);

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running with Socket.IO on port ${PORT}`)
);
