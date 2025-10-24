const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "changes_requested", "approved", "rejected"],
      default: "pending",
    },
    feedback: {
      comment: { type: String, trim: true },
      requestedChanges: { type: [String], default: [] },
      createdAt: { type: Date },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

SubmissionSchema.index({ project: 1, version: 1 });
SubmissionSchema.index({ student: 1, createdAt: -1 });
SubmissionSchema.index({ client: 1, status: 1 });

module.exports =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
