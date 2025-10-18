const { promisePool } = require('../config/database');

class StudentProfileModel {
  // Get user with full profile data including skills
  static async getUserWithSkills(userId) {
    try {
      const user = await this.findById(userId);
      
      if (!user) {
        return null;
      }
      
      // Get user skills
      const [skills] = await promisePool.execute(
        `SELECT s.id, s.name, s.category, us.proficiency_level, us.years_of_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [userId]
      );
      
      user.skills = skills;
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID with student profile
  static async findById(id) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT id, name, email, role, phone, bio, profile_picture,
                location, rating, total_reviews, is_verified, created_at 
         FROM users 
         WHERE id = ?`,
        [id]
      );
      
      // If user is a student, also get student profile
      if (rows[0] && rows[0].role === 'student') {
        const [studentProfile] = await promisePool.execute(
          `SELECT * FROM student_profiles WHERE user_id = ?`,
          [id]
        );
        
        if (studentProfile[0]) {
          rows[0].studentProfile = studentProfile[0];
        }
      }
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update user basic information
  static async updateUser(id, updateData) {
    try {
      const fields = [];
      const values = [];
      
      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const [result] = await promisePool.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update student profile
  static async updateStudentProfile(userId, profileData) {
    try {
      const fields = [];
      const values = [];
      
      // Build dynamic update query
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined && key !== 'user_id') {
          fields.push(`${key} = ?`);
          values.push(profileData[key]);
        }
      });
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(userId);
      
      const [result] = await promisePool.execute(
        `UPDATE student_profiles SET ${fields.join(', ')} WHERE user_id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Add skill to user
  static async addSkill(userId, skillId, proficiencyLevel = 'beginner', yearsOfExperience = 0) {
    try {
      const [result] = await promisePool.execute(
        `INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_of_experience)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         proficiency_level = VALUES(proficiency_level),
         years_of_experience = VALUES(years_of_experience)`,
        [userId, skillId, proficiencyLevel, yearsOfExperience]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Remove skill from user
  static async removeSkill(userId, skillId) {
    try {
      const [result] = await promisePool.execute(
        `DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?`,
        [userId, skillId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all available skills
  static async getAllSkills() {
    try {
      const [skills] = await promisePool.execute(
        `SELECT id, name, category FROM skills ORDER BY category, name`
      );
      
      return skills;
    } catch (error) {
      throw error;
    }
  }

  // Get user skills only
  static async getUserSkills(userId) {
    try {
      const [skills] = await promisePool.execute(
        `SELECT s.id, s.name, s.category, us.proficiency_level, us.years_of_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [userId]
      );
      
      return skills;
    } catch (error) {
      throw error;
    }
  }

  // Check if user has a specific skill
  static async hasSkill(userId, skillId) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT COUNT(*) as count FROM user_skills WHERE user_id = ? AND skill_id = ?`,
        [userId, skillId]
      );
      
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get student profile statistics
  static async getStudentStats(userId) {
    try {
      const [stats] = await promisePool.execute(
        `SELECT 
           sp.total_earnings,
           sp.projects_completed,
           u.rating,
           u.total_reviews,
           COUNT(DISTINCT us.skill_id) as skills_count
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         LEFT JOIN user_skills us ON u.id = us.user_id
         WHERE u.id = ? AND u.role = 'student'
         GROUP BY u.id`,
        [userId]
      );
      
      return stats[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Search students by skills
  static async searchStudentsBySkills(skillIds, limit = 10, offset = 0) {
    try {
      const placeholders = skillIds.map(() => '?').join(',');
      
      const [students] = await promisePool.execute(
        `SELECT DISTINCT u.id, u.name, u.email, u.bio, u.profile_picture, 
                u.location, u.rating, u.total_reviews, u.is_verified,
                sp.university, sp.course, sp.year_of_study, sp.hourly_rate,
                sp.availability, sp.experience_level
         FROM users u
         JOIN student_profiles sp ON u.id = sp.user_id
         JOIN user_skills us ON u.id = us.user_id
         WHERE u.role = 'student' AND us.skill_id IN (${placeholders})
         ORDER BY u.rating DESC, u.total_reviews DESC
         LIMIT ? OFFSET ?`,
        [...skillIds, limit, offset]
      );
      
      return students;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StudentProfileModel;
