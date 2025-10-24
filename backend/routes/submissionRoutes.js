const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createSubmission,
  getProjectSubmissions,
  getMySubmissions,
  reviewSubmission,
  deleteSubmission,
  getSubmissionById,
} = require("../controllers/submissionController");

router.post("/", protect, createSubmission);
router.get("/my-submissions", protect, getMySubmissions);
router.get("/project/:projectId", protect, getProjectSubmissions);
router.get("/:submissionId", protect, getSubmissionById);
router.post("/:submissionId/review", protect, reviewSubmission);
router.delete("/:submissionId", protect, deleteSubmission);

module.exports = router;
