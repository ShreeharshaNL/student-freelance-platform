-- =============================================
-- Student Freelance Platform Database Schema
-- =============================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS student_freelance_platform;
CREATE DATABASE student_freelance_platform;
USE student_freelance_platform;

-- =============================================
-- Table: users
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'client') NOT NULL,
    phone VARCHAR(15),
    bio TEXT,
    profile_picture VARCHAR(500),
    location VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- Table: student_profiles (extends users for students)
-- =============================================
CREATE TABLE student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    university VARCHAR(200),
    course VARCHAR(100),
    year_of_study INT,
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    resume_url VARCHAR(500),
    hourly_rate DECIMAL(10, 2),
    availability ENUM('full_time', 'part_time', 'weekends', 'flexible') DEFAULT 'flexible',
    experience_level ENUM('beginner', 'intermediate', 'expert') DEFAULT 'beginner',
    total_earnings DECIMAL(12, 2) DEFAULT 0.00,
    projects_completed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- =============================================
-- Table: skills
-- =============================================
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- =============================================
-- Table: user_skills (many-to-many relationship)
-- =============================================
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
    years_of_experience DECIMAL(3, 1) DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_id),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_id (skill_id)
);

-- =============================================
-- Table: projects
-- =============================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    budget_type ENUM('fixed', 'hourly') DEFAULT 'fixed',
    duration VARCHAR(50),
    deadline DATE,
    status ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
    visibility ENUM('public', 'private') DEFAULT 'public',
    required_skills TEXT, -- JSON array of skill IDs
    experience_level ENUM('beginner', 'intermediate', 'expert', 'any') DEFAULT 'any',
    attachments TEXT, -- JSON array of file URLs
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- Table: project_skills (many-to-many relationship)
-- =============================================
CREATE TABLE project_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id),
    INDEX idx_project_id (project_id),
    INDEX idx_skill_id (skill_id)
);

-- =============================================
-- Table: applications
-- =============================================
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    student_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    proposed_rate DECIMAL(10, 2),
    estimated_duration VARCHAR(100),
    status ENUM('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
    portfolio_samples TEXT, -- JSON array of URLs
    availability_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (project_id, student_id),
    INDEX idx_project_id (project_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

-- =============================================
-- Table: messages
-- =============================================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    project_id INT, -- Optional: messages can be related to a project
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    parent_message_id INT, -- For threaded conversations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_project_id (project_id),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- Table: project_assignments
-- =============================================
CREATE TABLE project_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    student_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    final_rate DECIMAL(10, 2),
    total_hours_worked DECIMAL(6, 2),
    status ENUM('assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'assigned',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (project_id, student_id),
    INDEX idx_project_id (project_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

-- =============================================
-- Table: payments
-- =============================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    student_id INT NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method ENUM('upi', 'bank_transfer', 'razorpay', 'paytm', 'other') DEFAULT 'bank_transfer',
    transaction_id VARCHAR(100) UNIQUE,
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    description TEXT,
    invoice_number VARCHAR(50),
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(12, 2), -- Amount after platform fee
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_student_id (student_id),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);

-- =============================================
-- Table: reviews
-- =============================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (project_id, reviewer_id, reviewee_id),
    INDEX idx_project_id (project_id),
    INDEX idx_reviewee_id (reviewee_id),
    INDEX idx_rating (rating)
);

-- =============================================
-- Table: notifications
-- =============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    related_id INT, -- Can reference project_id, application_id, etc.
    related_type VARCHAR(50), -- 'project', 'application', 'message', etc.
    is_read BOOLEAN DEFAULT FALSE,
    is_email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- Table: portfolios
-- =============================================
CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    live_demo_url VARCHAR(500),
    image_urls TEXT, -- JSON array of image URLs
    technologies_used TEXT, -- JSON array
    completion_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_is_featured (is_featured)
);

-- =============================================
-- Table: saved_projects (bookmarks)
-- =============================================
CREATE TABLE saved_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved (user_id, project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_project_id (project_id)
);

-- =============================================
-- Table: activity_logs
-- =============================================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- Table: platform_settings
-- =============================================
CREATE TABLE platform_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Insert default platform settings
-- =============================================
INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('platform_fee_percentage', '10', 'number', 'Platform fee percentage on transactions'),
('min_project_budget', '500', 'number', 'Minimum project budget in INR'),
('max_project_budget', '1000000', 'number', 'Maximum project budget in INR'),
('currency', 'INR', 'string', 'Default currency'),
('timezone', 'Asia/Kolkata', 'string', 'Default timezone'),
('gst_percentage', '18', 'number', 'GST percentage for Indian transactions');

-- =============================================
-- Insert sample skills
-- =============================================
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('C++', 'Programming'),
('PHP', 'Programming'),
('TypeScript', 'Programming'),
('Go', 'Programming'),
('Rust', 'Programming'),
('Swift', 'Programming'),
('Kotlin', 'Programming'),

-- Web Development
('React', 'Web Development'),
('Angular', 'Web Development'),
('Vue.js', 'Web Development'),
('Node.js', 'Web Development'),
('Express.js', 'Web Development'),
('Django', 'Web Development'),
('Flask', 'Web Development'),
('Spring Boot', 'Web Development'),
('Laravel', 'Web Development'),
('ASP.NET', 'Web Development'),

-- Mobile Development
('React Native', 'Mobile Development'),
('Flutter', 'Mobile Development'),
('iOS Development', 'Mobile Development'),
('Android Development', 'Mobile Development'),
('Ionic', 'Mobile Development'),

-- Databases
('MySQL', 'Database'),
('MongoDB', 'Database'),
('PostgreSQL', 'Database'),
('Redis', 'Database'),
('Oracle', 'Database'),
('SQL Server', 'Database'),

-- Cloud & DevOps
('AWS', 'Cloud & DevOps'),
('Google Cloud', 'Cloud & DevOps'),
('Azure', 'Cloud & DevOps'),
('Docker', 'Cloud & DevOps'),
('Kubernetes', 'Cloud & DevOps'),
('CI/CD', 'Cloud & DevOps'),

-- Design
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Adobe XD', 'Design'),
('Photoshop', 'Design'),
('Illustrator', 'Design'),

-- Other
('Machine Learning', 'Data Science'),
('Data Analysis', 'Data Science'),
('Blockchain', 'Emerging Tech'),
('Content Writing', 'Content'),
('SEO', 'Marketing'),
('Digital Marketing', 'Marketing');

-- =============================================
-- Create Views for common queries
-- =============================================

-- View: Active Projects Summary
CREATE VIEW active_projects_view AS
SELECT 
    p.id,
    p.title,
    p.budget_min,
    p.budget_max,
    p.status,
    p.created_at,
    u.name AS client_name,
    COUNT(DISTINCT a.id) AS application_count
FROM projects p
JOIN users u ON p.client_id = u.id
LEFT JOIN applications a ON p.id = a.project_id
WHERE p.status = 'open'
GROUP BY p.id;

-- View: Student Earnings Summary
CREATE VIEW student_earnings_view AS
SELECT 
    u.id AS student_id,
    u.name AS student_name,
    COUNT(DISTINCT pa.project_id) AS total_projects,
    SUM(p.net_amount) AS total_earnings,
    AVG(r.rating) AS average_rating
FROM users u
LEFT JOIN project_assignments pa ON u.id = pa.student_id
LEFT JOIN payments p ON u.id = p.student_id AND p.status = 'completed'
LEFT JOIN reviews r ON u.id = r.reviewee_id
WHERE u.role = 'student'
GROUP BY u.id;

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX idx_projects_status_created ON projects(status, created_at DESC);
CREATE INDEX idx_applications_status_created ON applications(status, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_payments_date_status ON payments(payment_date, status);

-- =============================================
-- Create triggers for updating user ratings
-- =============================================
DELIMITER //

CREATE TRIGGER update_user_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE users
    SET 
        rating = (
            SELECT AVG(rating)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE id = NEW.reviewee_id;
END//

DELIMITER ;

-- =============================================
-- Grant appropriate permissions (adjust as needed)
-- =============================================
-- CREATE USER 'freelance_app'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON student_freelance_platform.* TO 'freelance_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- Database creation completed successfully!
-- =============================================