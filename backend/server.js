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

// helper to allow preview deployments
const isAllowed = (origin) =>
  !origin ||
  allowedOrigins.includes(origin) ||
  /^https:\/\/.*\.vercel\.app$/.test(origin);

const corsOptions = {
  origin: (origin, cb) => {
    if (isAllowed(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle mobile preflight
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

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
