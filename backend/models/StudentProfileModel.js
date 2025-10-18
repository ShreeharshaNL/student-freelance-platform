const { db } = require('../config/database');

class StudentProfileModel {
  // Get user with full profile data including skills
  static async getUserWithSkills(userId) {
    return new Promise((resolve, reject) => {
      try {
        this.findById(userId).then(user => {
          if (!user) {
            resolve(null);
            return;
          }
          
          // Get user skills
          db.all(
            `SELECT s.id, s.name, s.category, us.proficiency_level, us.years_of_experience
             FROM user_skills us
             JOIN skills s ON us.skill_id = s.id
             WHERE us.user_id = ?`,
            [userId],
            (err, skills) => {
              if (err) {
                reject(err);
                return;
              }
              
              user.skills = skills || [];
              resolve(user);
            }
          );
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Find user by ID with student profile
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, role, phone, bio, profile_picture,
                location, rating, total_reviews, is_verified, created_at 
         FROM users 
         WHERE id = ?`,
        [id],
        async (err, user) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!user) {
            resolve(null);
            return;
          }
          
          // If user is a student, also get student profile
          if (user.role === 'student') {
            db.get(
              `SELECT * FROM student_profiles WHERE user_id = ?`,
              [id],
              (err, studentProfile) => {
                if (err) {
                  reject(err);
                  return;
                }
                
                if (studentProfile) {
                  user.studentProfile = studentProfile;
                }
                resolve(user);
              }
            );
          } else {
            resolve(user);
          }
        }
      );
    });
  }

  // Update user basic information
  static async updateUser(id, updateData) {
    return new Promise((resolve, reject) => {
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
          resolve(false);
          return;
        }
        
        values.push(id);
        
        db.run(
          `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
          values,
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.changes > 0);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Update student profile
  static async updateStudentProfile(userId, profileData) {
    return new Promise((resolve, reject) => {
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
          resolve(false);
          return;
        }
        
        values.push(userId);
        
        db.run(
          `UPDATE student_profiles SET ${fields.join(', ')} WHERE user_id = ?`,
          values,
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.changes > 0);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Add skill to user
  static async addSkill(userId, skillId, proficiencyLevel = 'beginner', yearsOfExperience = 0) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO user_skills (user_id, skill_id, proficiency_level, years_of_experience)
         VALUES (?, ?, ?, ?)`,
        [userId, skillId, proficiencyLevel, yearsOfExperience],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Remove skill from user
  static async removeSkill(userId, skillId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?`,
        [userId, skillId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Get all available skills
  static async getAllSkills() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, name, category FROM skills ORDER BY category, name`,
        (err, skills) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(skills || []);
        }
      );
    });
  }

  // Get user skills only
  static async getUserSkills(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.id, s.name, s.category, us.proficiency_level, us.years_of_experience
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = ?`,
        [userId],
        (err, skills) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(skills || []);
        }
      );
    });
  }

  // Check if user has a specific skill
  static async hasSkill(userId, skillId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM user_skills WHERE user_id = ? AND skill_id = ?`,
        [userId, skillId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row.count > 0);
        }
      );
    });
  }

  // Get student profile statistics
  static async getStudentStats(userId) {
    return new Promise((resolve, reject) => {
      db.get(
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
        [userId],
        (err, stats) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(stats || null);
        }
      );
    });
  }

  // Search students by skills
  static async searchStudentsBySkills(skillIds, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const placeholders = skillIds.map(() => '?').join(',');
      
      db.all(
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
        [...skillIds, limit, offset],
        (err, students) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(students || []);
        }
      );
    });
  }
}

module.exports = StudentProfileModel;
