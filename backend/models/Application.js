const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    proposedBudget: {
        type: Number,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    questions: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Ensure a student can only apply once to a project
applicationSchema.index({ project: 1, student: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;