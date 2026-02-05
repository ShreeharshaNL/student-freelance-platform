const Review = require("../models/Review");
const User = require("../models/User");
const ClientProfile = require("../models/ClientProfile");
const StudentProfile = require("../models/StudentProfile");
const Project = require("../models/Project");

exports.createReview = async (req, res) => {
  try {
    const { projectId, revieweeId, rating, comment, categories } = req.body;
    const reviewerId = req.user._id;

    if (!projectId || !revieweeId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "Project, reviewee, rating, and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: reviewerId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this project",
      });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      reviewerRole: req.user.role,
      rating,
      comment,
      categories: categories || {},
    });

    await review.populate([
      { path: "reviewer", select: "name email role" },
      { path: "reviewee", select: "name email role" },
      { path: "project", select: "title" },
    ]);

    await updateUserRating(revieweeId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create review",
    });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewee: userId, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("reviewer", "name email role")
      .populate("project", "title");

    const total = await Review.countDocuments({
      reviewee: userId,
      isPublic: true,
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
};

exports.getReviewsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const reviews = await Review.find({ project: projectId })
      .sort({ createdAt: -1 })
      .populate("reviewer", "name email role")
      .populate("reviewee", "name email role");

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Error fetching project reviews:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch project reviews",
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "received" } = req.query;

    console.log('🔍 getMyReviews called:', { 
      userId: userId.toString(),
      type,
      userRole: req.user.role 
    });

    const query = type === "received" 
      ? { reviewee: userId } 
      : { reviewer: userId };
    
    console.log('🔍 Using query:', query);

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate("reviewer", "name email role")
      .populate("reviewee", "name email role")
      .populate("project", "title");

    console.log('📦 Found reviews:', {
      count: reviews.length,
      reviews: reviews.map(r => ({
        id: r._id,
        reviewer: r.reviewer?.name,
        reviewee: r.reviewee?.name,
        rating: r.rating,
        project: r.project?.title,
        createdAt: r.createdAt
      }))
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Error fetching my reviews:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
    });
  }
};

exports.respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: "Response comment is required",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    if (review.reviewee.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only respond to reviews about you",
      });
    }

    review.response = {
      comment,
      createdAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    console.error("Error responding to review:", err);
    res.status(500).json({
      success: false,
      error: "Failed to respond to review",
    });
  }
};

exports.canReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: userId,
    });

    const canReview = !existingReview && project.status === "completed";

    res.status(200).json({
      success: true,
      data: {
        canReview,
        hasReviewed: !!existingReview,
        projectStatus: project.status,
      },
    });
  } catch (err) {
    console.error("Error checking review eligibility:", err);
    res.status(500).json({
      success: false,
      error: "Failed to check review eligibility",
    });
  }
};

async function updateUserRating(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const reviews = await Review.find({ reviewee: userId });

    const count = reviews.length;
    let averageRating = 0;

    if (count > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / count).toFixed(1);
    }

    const updateData = {
      rating: parseFloat(averageRating),
      totalReviews: count,
    };

    if (user.role === "client") {
      await ClientProfile.findOneAndUpdate({ user: userId }, updateData);
    } else if (user.role === "student") {
      await StudentProfile.findOneAndUpdate({ user: userId }, updateData);
    }
  } catch (err) {
    console.error("Error updating user rating:", err);
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    if (review.reviewer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own reviews",
      });
    }

    await review.deleteOne();

    await updateUserRating(review.reviewee);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete review",
    });
  }
};
