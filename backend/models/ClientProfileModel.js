const mongoose = require("mongoose");

const ClientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Header / basics
    companyName: { type: String, trim: true, default: "New Company" },
    industryType: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    joinDate: { type: String, default: "" },        // keep as string to match frontend
    website: { type: String, trim: true, default: "" },
    companySize: { type: String, trim: true, default: "" },
    profileImage: { type: String, trim: true, default: "" },

    // Stats (types match your frontend expectations)
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    projectsPosted: { type: Number, default: 0 },
    totalSpent: { type: String, default: "₹0" },    // ⚠️ string, not number
    hiredStudents: { type: Number, default: 0 },
    responseTime: { type: String, trim: true, default: "" },

    // About
    description: { type: String, trim: true, default: "" },

    // Collections (stay arrays; frontend renders arrays)
    postedProjects: { type: Array, default: [] },
    hiredHistory: { type: Array, default: [] },
    reviews: { type: Array, default: [] },
    stats: { type: Array, default: [] },            // ⚠️ array, not object
  },
  { timestamps: true }
);

// Prevent OverwriteModelError on dev reloads
module.exports =
  mongoose.models.ClientProfile ||
  mongoose.model("ClientProfile", ClientProfileSchema);
