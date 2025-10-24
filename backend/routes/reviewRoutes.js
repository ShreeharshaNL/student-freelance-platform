const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createReview,
  getReviewsForUser,
  getReviewsForProject,
  getMyReviews,
  respondToReview,
  canReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/my-reviews", protect, getMyReviews);
router.get("/user/:userId", getReviewsForUser);
router.get("/project/:projectId", getReviewsForProject);
router.get("/can-review/:projectId", protect, canReview);
router.post("/:reviewId/respond", protect, respondToReview);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
