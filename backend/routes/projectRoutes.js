const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProjects,
    createProject,
    getProjectById,
    getMyProjects,
    getMyProjectsWithApplications,
    calculateFees,
    applyToProject,
    getMyApplications,
    updateApplicationStatus
} = require('../controllers/projectController');

// Protected routes for project management
router.post('/', protect, createProject); // Create project (clients only)
router.post('/calculate-fees', protect, calculateFees); // Calculate project fees
router.get('/my', protect, getMyProjects); // Get client's projects
router.get('/my-with-applications', protect, getMyProjectsWithApplications); // Get client's projects with applications
router.get('/my-applications', protect, getMyApplications); // Get student's applications
router.post('/:id/apply', protect, applyToProject); // Apply to a project
router.put('/applications/:id/status', protect, updateApplicationStatus); // Update application status

// Public routes for project discovery
router.get('/', getProjects); // Get all projects (with filters)
router.get('/:id', getProjectById); // Get single project

module.exports = router;