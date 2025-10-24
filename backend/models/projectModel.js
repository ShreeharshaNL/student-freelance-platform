const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            'web-development',
            'graphic-design',
            'content-writing',
            'data-entry',
            'digital-marketing',
            'mobile-app',
            'video-editing',
            'translation'
        ]
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open',
    },
    budget: {
        type: Number,
        required: true,
    },
    budgetType: {
        type: String,
        required: true,
        enum: ['fixed', 'hourly'],
        default: 'fixed'
    },
    deadline: {
        type: Date,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true,
    },
    projectType: {
        type: String,
        required: true,
        enum: ['short-term', 'medium-term', 'long-term'],
        default: 'short-term'
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    applications: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        proposedBudget: {
            type: Number,
            required: true
        },
        timeline: {
            type: String,
            required: true
        },
        coverLetter: {
            type: String,
            required: true
        },
        questions: {
            type: String
        },
        attachments: [{
            fileName: String,
            fileUrl: String
        }],
        progress: {
            type: Number,
            default: 0
        },
        completionDate: Date
    }]
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;