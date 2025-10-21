const express = require('express');
const router = express.Router();
// highlight-next-line
const { getProjects } = require('../controllers/projectController'); // Import the controller
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/projectModel');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, category, budget, skillsRequired } = req.body;
    try {
        const project = new Project({
            user: req.user.id,
            title,
            description,
            category,
            budget,
            skillsRequired,
        });
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/projects
// @desc    Get all projects with filtering
// @access  Public
// highlight-next-line
router.get('/', getProjects); // Use the new controller function

module.exports = router;