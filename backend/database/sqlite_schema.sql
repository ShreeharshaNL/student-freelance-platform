-- =============================================
-- Student Freelance Platform Database Schema (SQLite)
-- =============================================

-- =============================================
-- Table: users
-- =============================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role TEXT CHECK(role IN ('student', 'client')) NOT NULL,
    phone VARCHAR(15),
    bio TEXT,
    profile_picture VARCHAR(500),
    location VARCHAR(100),
    rating REAL DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: student_profiles (extends users for students)
-- =============================================
CREATE TABLE student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    university VARCHAR(200),
    course VARCHAR(100),
    year_of_study INTEGER,
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    resume_url VARCHAR(500),
    hourly_rate REAL,
    availability TEXT CHECK(availability IN ('full_time', 'part_time', 'weekends', 'flexible')) DEFAULT 'flexible',
    experience_level TEXT CHECK(experience_level IN ('beginner', 'intermediate', 'expert')) DEFAULT 'beginner',
    total_earnings REAL DEFAULT 0.00,
    projects_completed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Table: skills
-- =============================================
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: user_skills (many-to-many relationship)
-- =============================================
CREATE TABLE user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    proficiency_level TEXT CHECK(proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
    years_of_experience REAL DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(user_id, skill_id)
);

-- =============================================
-- Insert sample skills
-- =============================================
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('C++', 'Programming'),
('PHP', 'Programming'),
('TypeScript', 'Programming'),
('React', 'Web Development'),
('Angular', 'Web Development'),
('Vue.js', 'Web Development'),
('Node.js', 'Web Development'),
('Express.js', 'Web Development'),
('Django', 'Web Development'),
('Flask', 'Web Development'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('PostgreSQL', 'Database'),
('AWS', 'Cloud & DevOps'),
('Docker', 'Cloud & DevOps'),
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Machine Learning', 'Data Science'),
('Content Writing', 'Content'),
('SEO', 'Marketing');
