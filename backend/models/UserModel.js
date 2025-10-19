const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'client'], // A user can only be a student or a client
        required: true,
    },
    skills: {
        type: [String], // Array of strings for student skills
        default: [],
    },
    // You can add more fields later like portfolio, completed projects, etc.
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;