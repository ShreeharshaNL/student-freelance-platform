const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // highlight-start
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'in-progress', 'completed'], // The status can only be one of these
        default: 'open',
    },
    // highlight-end
    budget: {
        type: Number,
        required: true,
    },
    skillsRequired: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;