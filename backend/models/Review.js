const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ["student", "client"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      quality: { type: Number, min: 1, max: 5 },
      professionalism: { type: Number, min: 1, max: 5 },
      timeliness: { type: Number, min: 1, max: 5 },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    response: {
      comment: { type: String, trim: true, maxlength: 500 },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });
ReviewSchema.index({ reviewee: 1, createdAt: -1 });

module.exports =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
