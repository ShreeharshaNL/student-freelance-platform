const StudentProfileModel = require('../models/StudentProfileModel');
const { validationResult } = require('express-validator');

class StudentProfileController {
  // Get current user's profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user with full profile data
      const user = await StudentProfileModel.getUserWithSkills(userId);
      
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
  }

  // Update current user's basic profile
  static async updateProfile(req, res) {
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
      const updateData = { ...req.body };

      // Handle skills separately if provided
      let skillsToUpdate = null;
      if (updateData.skills) {
        skillsToUpdate = updateData.skills;
        delete updateData.skills; // Remove from main update data
      }

      // Remove any fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.email; // Email should be updated separately
      delete updateData.role; // Role cannot be changed
      delete updateData.password; // Password should be updated separately
      delete updateData.rating; // Rating is calculated
      delete updateData.total_reviews; // Reviews are calculated
      delete updateData.is_verified; // Verification is admin-only
      delete updateData.created_at; // Created date cannot be changed

      // Update user profile (only if there are fields to update)
      let updated = true;
      if (Object.keys(updateData).length > 0) {
        updated = await StudentProfileModel.updateUser(userId, updateData);
        
        if (!updated) {
          return res.status(400).json({
            success: false,
            message: 'No valid fields to update'
          });
        }
      }

      // Handle skills update if provided
      if (skillsToUpdate && Array.isArray(skillsToUpdate)) {
        await StudentProfileModel.updateUserSkills(userId, skillsToUpdate);
      }

      // Get updated user data
      const user = await StudentProfileModel.getUserWithSkills(userId);
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
  }

  // Update student-specific profile
  static async updateStudentProfile(req, res) {
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
      const updated = await StudentProfileModel.updateStudentProfile(userId, profileData);
      
      if (!updated) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
      }

      // Get updated user data
      const user = await StudentProfileModel.getUserWithSkills(userId);
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
  }

  // Add or update user skills
  static async addSkill(req, res) {
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
      const added = await StudentProfileModel.addSkill(userId, skill_id, proficiency_level, years_of_experience);
      
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
  }

  // Remove user skill
  static async removeSkill(req, res) {
    try {
      const userId = req.user.id;
      const skillId = req.params.skillId;

      // Remove skill from user
      const removed = await StudentProfileModel.removeSkill(userId, skillId);
      
      if (!removed) {
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
  }

  // Get all available skills
  static async getAllSkills(req, res) {
    try {
      const skills = await StudentProfileModel.getAllSkills();

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
  }
}

module.exports = StudentProfileController;
