const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  addSkill,
  deleteSkill,
  addPortfolioProject,
  deletePortfolioProject,
  addEducation,
  deleteEducation,
  addCertification,
  deleteCertification
} = require("../controllers/ProfileController");


// Profile routes
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

// Skills routes
router.post("/skills", protect, addSkill);
router.delete("/skills/:skillId", protect, deleteSkill);

// Portfolio routes
router.post("/portfolio", protect, addPortfolioProject);
router.delete("/portfolio/:projectId", protect, deletePortfolioProject);

// Education routes
router.post("/education", protect, addEducation);
router.delete("/education/:eduId", protect, deleteEducation);

// Certification routes
router.post("/certifications", protect, addCertification);
router.delete("/certifications/:certId", protect, deleteCertification);

module.exports = router;