const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    submitApplication,
    getProjectApplications,
    getMyApplications,
    updateApplicationStatus,
    deleteApplication
} = require('../controllers/applicationController');

// Routes for all applications
router.post('/project/:projectId', protect, submitApplication); // Submit application to a project
router.get('/project/:projectId', protect, getProjectApplications); // Get all applications for a project
router.put('/:applicationId', protect, updateApplicationStatus); // Update application status
router.delete('/:applicationId', protect, deleteApplication); // Delete application

// Route for getting student's own applications
router.get('/me', protect, getMyApplications); // Get student's applications

module.exports = router;