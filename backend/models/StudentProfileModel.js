const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    // Profile Info
    title: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    location: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: null,
    },
    
    // Skills
    skills: [{
      name: { type: String, required: true },
      level: { type: Number, min: 0, max: 100, default: 0 },
      projects: { type: Number, default: 0 }
    }],
    
    // Education
    education: [{
      degree: String,
      school: String,
      year: String,
      status: String
    }],
    
    // Certifications
    certifications: [{
      name: String,
      issuer: String,
      year: String
    }],
    
    // Portfolio
    portfolio: [{
      title: String,
      description: String,
      image: String,
      technologies: [String],
      link: String
    }],
    
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
    completedProjects: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
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

module.exports = mongoose.model("StudentProfile", studentProfileSchema);