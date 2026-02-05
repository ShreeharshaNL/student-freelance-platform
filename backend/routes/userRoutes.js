//userRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboard,
  findUserByEmail,
  getUserProfile,
  updateProfile,
  addSkill,
  updateSkill,
  deleteSkill,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  addEducation,
  deleteEducation,
  addCertification,
  deleteCertification
} = require("../controllers/userController");

// User dashboard route
router.get("/dashboard", protect, getDashboard);

// Find user by email
router.get("/by-email", protect, findUserByEmail);

// Profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);

// Get user by ID
router.get("/:userId", protect, getUserProfile);

// Skills routes
router.post("/profile/skills", protect, addSkill);
router.put("/profile/skills/:skillId", protect, updateSkill);
router.delete("/profile/skills/:skillId", protect, deleteSkill);

// Portfolio routes
router.post("/profile/portfolio", protect, addPortfolioProject);
router.put("/profile/portfolio/:projectId", protect, updatePortfolioProject);
router.delete("/profile/portfolio/:projectId", protect, deletePortfolioProject);

// Education routes
router.post("/profile/education", protect, addEducation);
router.delete("/profile/education/:eduId", protect, deleteEducation);

// Certification routes
router.post("/profile/certifications", protect, addCertification);
router.delete("/profile/certifications/:certId", protect, deleteCertification);

module.exports = router;

