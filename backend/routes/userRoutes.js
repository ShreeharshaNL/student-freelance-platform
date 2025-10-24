//userRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboard, findUserByEmail, getUserById } = require("../controllers/userController");

// Protected dashboard route
router.get("/dashboard", protect, getDashboard);

// Find user by email
router.get("/by-email", protect, findUserByEmail);

// Get user by ID
router.get("/:userId", protect, getUserById);

module.exports = router;
