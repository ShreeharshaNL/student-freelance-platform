const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create a new user
  static async create(userData) {
    const { name, email, password, role, phone = null } = userData;
    
    return new Promise(async (resolve, reject) => {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        db.run(
          `INSERT INTO users (name, email, password, role, phone) 
           VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, role, phone],
          async function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            const userId = this.lastID;
            
            // If user is a student, create student profile
            if (role === 'student') {
              db.run(
                `INSERT INTO student_profiles (user_id) VALUES (?)`,
                [userId],
                (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  
                  resolve({
                    id: userId,
                    name,
                    email,
                    role,
                    phone
                  });
                }
              );
            } else {
              resolve({
                id: userId,
                name,
                email,
                role,
                phone
              });
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Find user by email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, password, role, phone, 
                rating, total_reviews, is_verified, created_at 
         FROM users 
         WHERE email = ?`,
        [email],
        (err, user) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(user || null);
        }
      );
    });
  }
  
  // Find user by ID
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
  
  // Update user
  static async update(id, updateData) {
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
  
  // Check if email exists
  static async emailExists(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM users WHERE email = ?`,
        [email],
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
  
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // ===== NEW SESSION MANAGEMENT METHODS =====
  
  // Store refresh token (for JWT with refresh token strategy)
  static async storeRefreshToken(userId, refreshToken, expiresAt) {
    try {
      // First, invalidate any existing tokens for this user
      await promisePool.execute(
        `UPDATE user_sessions SET is_active = 0 WHERE user_id = ?`,
        [userId]
      );
      
      // Store new refresh token
      const [result] = await promisePool.execute(
        `INSERT INTO user_sessions (user_id, refresh_token, expires_at, is_active) 
         VALUES (?, ?, ?, 1)`,
        [userId, refreshToken, expiresAt]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Find active refresh token
  static async findActiveRefreshToken(refreshToken) {
    try {
      const [rows] = await promisePool.execute(
        `SELECT us.*, u.id as user_id, u.name, u.email, u.role 
         FROM user_sessions us
         JOIN users u ON us.user_id = u.id
         WHERE us.refresh_token = ? AND us.is_active = 1 AND us.expires_at > NOW()`,
        [refreshToken]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Logout - invalidate refresh token
  static async logout(userId, refreshToken = null) {
    try {
      let query = `UPDATE user_sessions SET is_active = 0, logged_out_at = NOW() WHERE user_id = ?`;
      let params = [userId];
      
      // If specific refresh token provided, only invalidate that session
      if (refreshToken) {
        query += ` AND refresh_token = ?`;
        params.push(refreshToken);
      }
      
      const [result] = await promisePool.execute(query, params);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Logout from all devices
  static async logoutFromAllDevices(userId) {
    try {
      const [result] = await promisePool.execute(
        `UPDATE user_sessions SET is_active = 0, logged_out_at = NOW() WHERE user_id = ?`,
        [userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Clean up expired tokens (should be called periodically)
  static async cleanupExpiredTokens() {
    try {
      const [result] = await promisePool.execute(
        `DELETE FROM user_sessions WHERE expires_at < NOW() OR (is_active = 0 AND logged_out_at < DATE_SUB(NOW(), INTERVAL 30 DAY))`
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
  
  // Update last activity (for session tracking)
  static async updateLastActivity(userId) {
    try {
      const [result] = await promisePool.execute(
        `UPDATE users SET last_activity = NOW() WHERE id = ?`,
        [userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // ===== EXISTING METHODS CONTINUE =====
  
  // Get user with skills
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
}

module.exports = UserModel;