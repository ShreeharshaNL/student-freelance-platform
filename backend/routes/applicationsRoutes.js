const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    submitApplication,
    getMyApplications,
    getProjectApplications,
    updateApplicationStatus,
    deleteApplication
} = require('../controllers/applicationController');

// Application routes
router.get('/me', protect, getMyApplications); // Get student's applications
router.post('/project/:projectId', protect, submitApplication); // Submit application
router.get('/project/:projectId', protect, getProjectApplications); // Get project applications
router.put('/:applicationId', protect, updateApplicationStatus); // Update application status
router.delete('/:applicationId', protect, deleteApplication); // Delete application

module.exports = router;