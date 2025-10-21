//userRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboard, findUserByEmail } = require("../controllers/userController");

// Protected dashboard route
router.get("/dashboard", protect, getDashboard);

// Find user by email
router.get("/by-email", protect, findUserByEmail);

module.exports = router;
