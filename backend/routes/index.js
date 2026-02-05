const express = require("express");
const router = express.Router();

// Import all route modules
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const messagesRoutes = require("./messagesRoutes");
const projectRoutes = require("./projectRoutes");
const applicationsRoutes = require("./applicationsRoute");
const reviewRoutes = require("./reviewRoutes");
const submissionRoutes = require("./submissionRoutes");
const chatbotRoutes = require("./chatbotRoutes");

// Register all routes with their respective paths
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/messages", messagesRoutes);
router.use("/projects", projectRoutes);
router.use("/applications", applicationsRoutes);
router.use("/reviews", reviewRoutes);
router.use("/submissions", submissionRoutes);
router.use("/chatbot", chatbotRoutes);

module.exports = router;
