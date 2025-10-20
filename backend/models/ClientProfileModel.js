const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    // Company Info
    companyName: {
      type: String,
      default: "",
    },
    industryType: {
      type: String,
      default: "",
    },
    companySize: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    profileImage: {
      type: String,
      default: null,
    },
    
    // Stats
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    projectsPosted: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    hiredStudents: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: String,
      default: "N/A",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientProfile", clientProfileSchema);