const express = require('express');
const { body } = require('express-validator');
const StudentProfileController = require('../controllers/StudentProfileController');
const { verifyToken, isStudent } = require('../middleware/auth');

const router = express.Router();

// Validation rules for profile updates
const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  body('profile_picture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Skill name must be between 1 and 50 characters'),
  body('skills.*.level')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Skill level must be between 0 and 100')
];

// Validation rules for student profile updates
const studentProfileUpdateValidation = [
  body('university')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('University name must be less than 200 characters'),
  body('course')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Course name must be less than 100 characters'),
  body('year_of_study')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Year of study must be between 1 and 10'),
  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('linkedin_url')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),
  body('portfolio_url')
    .optional()
    .isURL()
    .withMessage('Portfolio URL must be a valid URL'),
  body('resume_url')
    .optional()
    .isURL()
    .withMessage('Resume URL must be a valid URL'),
  body('hourly_rate')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Hourly rate must be between 0 and 10000'),
  body('availability')
    .optional()
    .isIn(['full_time', 'part_time', 'weekends', 'flexible'])
    .withMessage('Availability must be one of: full_time, part_time, weekends, flexible'),
  body('experience_level')
    .optional()
    .isIn(['beginner', 'intermediate', 'expert'])
    .withMessage('Experience level must be one of: beginner, intermediate, expert')
];

// Validation rules for skill management
const skillValidation = [
  body('skill_id')
    .isInt({ min: 1 })
    .withMessage('Skill ID must be a positive integer'),
  body('proficiency_level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Proficiency level must be one of: beginner, intermediate, advanced, expert'),
  body('years_of_experience')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50')
];

// =============================================
// PROFILE ROUTES
// =============================================

// @route   GET /api/student-profile
// @desc    Get current user's profile
// @access  Private
router.get('/', verifyToken, StudentProfileController.getProfile);

// @route   PUT /api/student-profile
// @desc    Update current user's basic profile
// @access  Private
router.put('/', verifyToken, profileUpdateValidation, StudentProfileController.updateProfile);

// @route   PUT /api/student-profile/student
// @desc    Update student-specific profile
// @access  Private (Students only)
router.put('/student', verifyToken, isStudent, studentProfileUpdateValidation, StudentProfileController.updateStudentProfile);

// =============================================
// SKILLS ROUTES
// =============================================

// @route   GET /api/student-profile/skills
// @desc    Get all available skills
// @access  Public
router.get('/skills', StudentProfileController.getAllSkills);

// @route   POST /api/student-profile/skills
// @desc    Add or update user skills
// @access  Private
router.post('/skills', verifyToken, skillValidation, StudentProfileController.addSkill);

// @route   DELETE /api/student-profile/skills/:skillId
// @desc    Remove user skill
// @access  Private
router.delete('/skills/:skillId', verifyToken, StudentProfileController.removeSkill);

module.exports = router;
