const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Create SQLite database connection
const dbPath = path.join(__dirname, '..', 'database', 'student_freelance_platform.db');
const db = new sqlite3.Database(dbPath);

// Test database connection
const testConnection = async () => {
  return new Promise((resolve) => {
    db.get("SELECT 1", (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        resolve(false);
      } else {
        console.log('✅ SQLite Database connected successfully');
        resolve(true);
      }
    });
  });
};

// Initialize database with schema
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const schemaPath = path.join(__dirname, '..', 'database', 'sqlite_schema.sql');
    
    try {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      const sqliteSchema = schema
        .split(';')
        .filter(sql => sql.trim().length > 0);

      let completed = 0;
      const total = sqliteSchema.length;

      sqliteSchema.forEach((sql, index) => {
        if (sql.trim()) {
          db.run(sql, (err) => {
            if (err && !err.message.includes('already exists')) {
              console.error(`Error executing SQL ${index + 1}:`, err.message);
              console.error('SQL:', sql.substring(0, 100) + '...');
            }
            completed++;
            if (completed === total) {
              resolve();
            }
          });
        } else {
          completed++;
          if (completed === total) {
            resolve();
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  db,
  testConnection,
  initializeDatabase
};