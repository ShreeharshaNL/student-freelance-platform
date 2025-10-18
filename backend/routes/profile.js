const express = require('express');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');
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
    .withMessage('Profile picture must be a valid URL')
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

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with full profile data
    const user = await UserModel.getUserWithSkills(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    delete user.password;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          profile_picture: user.profile_picture,
          location: user.location,
          rating: user.rating,
          total_reviews: user.total_reviews,
          is_verified: user.is_verified,
          created_at: user.created_at,
          studentProfile: user.studentProfile || null,
          skills: user.skills || []
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/profile
// @desc    Update current user's basic profile
// @access  Private
router.put('/', verifyToken, profileUpdateValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const updateData = req.body;

    // Remove any fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.email; // Email should be updated separately
    delete updateData.role; // Role cannot be changed
    delete updateData.password; // Password should be updated separately
    delete updateData.rating; // Rating is calculated
    delete updateData.total_reviews; // Reviews are calculated
    delete updateData.is_verified; // Verification is admin-only
    delete updateData.created_at; // Created date cannot be changed

    // Update user profile
    const updated = await UserModel.update(userId, updateData);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Get updated user data
    const user = await UserModel.getUserWithSkills(userId);
    delete user.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          profile_picture: user.profile_picture,
          location: user.location,
          rating: user.rating,
          total_reviews: user.total_reviews,
          is_verified: user.is_verified,
          created_at: user.created_at,
          studentProfile: user.studentProfile || null,
          skills: user.skills || []
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/profile/student
// @desc    Update student-specific profile
// @access  Private (Students only)
router.put('/student', verifyToken, isStudent, studentProfileUpdateValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const profileData = req.body;

    // Remove any fields that shouldn't be updated directly
    delete profileData.id;
    delete profileData.user_id;
    delete profileData.total_earnings; // Earnings are calculated
    delete profileData.projects_completed; // Projects completed are calculated

    // Update student profile
    const updated = await UserModel.updateStudentProfile(userId, profileData);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Get updated user data
    const user = await UserModel.getUserWithSkills(userId);
    delete user.password;

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          profile_picture: user.profile_picture,
          location: user.location,
          rating: user.rating,
          total_reviews: user.total_reviews,
          is_verified: user.is_verified,
          created_at: user.created_at,
          studentProfile: user.studentProfile || null,
          skills: user.skills || []
        }
      }
    });

  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/profile/skills
// @desc    Add or update user skills
// @access  Private
router.post('/skills', verifyToken, [
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
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { skill_id, proficiency_level, years_of_experience = 0 } = req.body;

    // Add skill to user
    const added = await UserModel.addSkill(userId, skill_id, proficiency_level, years_of_experience);
    
    if (!added) {
      return res.status(400).json({
        success: false,
        message: 'Failed to add skill'
      });
    }

    res.json({
      success: true,
      message: 'Skill added successfully'
    });

  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding skill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/profile/skills/:skillId
// @desc    Remove user skill
// @access  Private
router.delete('/skills/:skillId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.skillId;

    // Remove skill from user
    const { promisePool } = require('../config/database');
    const [result] = await promisePool.execute(
      `DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?`,
      [userId, skillId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found or not associated with user'
      });
    }

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });

  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing skill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/profile/skills
// @desc    Get all available skills
// @access  Public
router.get('/skills', async (req, res) => {
  try {
    const { promisePool } = require('../config/database');
    const [skills] = await promisePool.execute(
      `SELECT id, name, category FROM skills ORDER BY category, name`
    );

    res.json({
      success: true,
      data: {
        skills
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
