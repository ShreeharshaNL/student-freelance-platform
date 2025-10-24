const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic Info
    title: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    responseTime: { type: String, trim: true, default: "" },

    // Skills
    skills: {
      type: [
        {
          name: { type: String, required: true },
          level: { type: Number, default: 0 },
          projects: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    // Portfolio
    portfolio: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          image: { type: String, default: "💼" },
          technologies: { type: [String], default: [] },
          link: { type: String, default: "#" },
        },
      ],
      default: [],
    },

    // Education
    education: {
      type: [
        {
          degree: { type: String, required: true },
          school: { type: String, required: true },
          year: { type: String, default: "" },
          status: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // Certifications
    certifications: {
      type: [
        {
          name: { type: String, required: true },
          issuer: { type: String, required: true },
          year: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // Dashboard Stats
    totalEarnings: { type: Number, default: 0 },
    monthlyEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during nodemon reloads
module.exports =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", StudentProfileSchema);
