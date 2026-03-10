-- ============================================
-- SAO E-RECORD SYSTEM - DATABASE SCHEMA
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS excuse_slips;
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS violations;
DROP TABLE IF EXISTS class_officers;
DROP TABLE IF EXISTS teacher_subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sections;

-- Users table (for authentication)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'sao', 'parent') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Sections table
CREATE TABLE sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  grade_level INT NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  strand VARCHAR(50),
  adviser_id INT,
  school_year VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_section (grade_level, section_name, school_year),
  INDEX idx_grade (grade_level)
);

-- Parents/Guardians table
CREATE TABLE parents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  full_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50),
  contact_number VARCHAR(20),
  email VARCHAR(255),
  home_address TEXT,
  occupation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email)
);

-- Students table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  lrn VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  birth_date DATE,
  contact_number VARCHAR(20),
  email VARCHAR(255),
  profile_picture VARCHAR(255),
  section_id INT,
  parent_id INT,
  enrollment_status ENUM('Active', 'Inactive', 'Graduated', 'Transferred') DEFAULT 'Active',
  school_year VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL,
  INDEX idx_lrn (lrn),
  INDEX idx_section (section_id),
  INDEX idx_status (enrollment_status)
);

-- Teachers table
CREATE TABLE teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  contact_number VARCHAR(20),
  email VARCHAR(255),
  profile_picture VARCHAR(255),
  department VARCHAR(100),
  position VARCHAR(100),
  advisory_section_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (advisory_section_id) REFERENCES sections(id) ON DELETE SET NULL,
  INDEX idx_employee (employee_id),
  INDEX idx_advisory (advisory_section_id)
);

-- Teacher Subjects table
CREATE TABLE teacher_subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  section_id INT NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  schedule VARCHAR(100),
  school_year VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_teacher_subject (teacher_id, section_id, subject_name, school_year)
);

-- Class Officers table
CREATE TABLE class_officers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  section_id INT NOT NULL,
  position VARCHAR(50) NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_position (section_id, position, school_year)
);

-- Attendance Records table
CREATE TABLE attendance_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  time_in TIME,
  status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
  remarks TEXT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_attendance (student_id, date),
  INDEX idx_date (date),
  INDEX idx_status (status)
);

-- Violations table
CREATE TABLE violations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  violation_type VARCHAR(100) NOT NULL,
  description TEXT,
  date_committed DATE NOT NULL,
  action_taken TEXT,
  status ENUM('Pending', 'Resolved', 'Escalated') DEFAULT 'Pending',
  reported_by INT,
  resolved_by INT,
  resolved_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_date (date_committed)
);

-- Excuse Slips table
CREATE TABLE excuse_slips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  reason VARCHAR(100) NOT NULL,
  date_of_absence DATE NOT NULL,
  image_path VARCHAR(255),
  additional_notes TEXT,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  reviewed_by INT,
  reviewed_at DATETIME,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_date (date_of_absence)
);

-- Appointments table
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  appointment_type ENUM('Violation', 'Attendance Matters', 'Consultation', 'Document Request', 'Guidance', 'Other') NOT NULL,
  matter VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  details TEXT,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  confirmed_by INT,
  confirmed_at DATETIME,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (confirmed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_date (date),
  INDEX idx_status (status)
);

-- Notifications table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('appointments', 'violations', 'attendance', 'documents', 'general') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  is_read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_read (is_read),
  INDEX idx_created (created_at)
);

-- Activity Logs table
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);

-- Insert default SAO admin user
INSERT INTO users (email, password, role, is_active) VALUES
('sao@cccs.edu', '$2b$10$YourHashedPasswordHere', 'sao', TRUE);

-- Insert sample sections for Grade 7
INSERT INTO sections (grade_level, section_name, school_year) VALUES
(7, 'St. Anthony', '2025-2026'),
(7, 'St. Elizabeth', '2025-2026'),
(7, 'St. Francis', '2025-2026'),
(7, 'St. Joseph', '2025-2026'),
(7, 'St. Michael', '2025-2026'),
(7, 'St. Roque', '2025-2026'),
(7, 'St. Thomas', '2025-2026');

-- Insert sample sections for Grade 8
INSERT INTO sections (grade_level, section_name, school_year) VALUES
(8, 'St. Andrew', '2025-2026'),
(8, 'St. Jude', '2025-2026'),
(8, 'St. Lorenzo', '2025-2026'),
(8, 'St. Martin', '2025-2026'),
(8, 'St. Paul', '2025-2026'),
(8, 'St. Peter', '2025-2026');

-- Insert sample sections for Grade 9
INSERT INTO sections (grade_level, section_name, school_year) VALUES
(9, 'St. Agnes', '2025-2026'),
(9, 'St. Anne', '2025-2026'),
(9, 'St. Bernadette', '2025-2026'),
(9, 'St. Bridget', '2025-2026'),
(9, 'St. Monica', '2025-2026'),
(9, 'St. Therese', '2025-2026');

-- Insert sample sections for Grade 10
INSERT INTO sections (grade_level, section_name, school_year) VALUES
(10, 'St. Benedict', '2025-2026'),
(10, 'St. John', '2025-2026'),
(10, 'St. Luke', '2025-2026'),
(10, 'St. Mark', '2025-2026'),
(10, 'St. Matthew', '2025-2026'),
(10, 'St. Phillip', '2025-2026');

-- Insert sample sections for Grade 11
INSERT INTO sections (grade_level, section_name, strand, school_year) VALUES
(11, 'St. Gregory', 'STEM', '2025-2026'),
(11, 'St. Ignatius', 'STEM', '2025-2026'),
(11, 'St. Pedro Calungsod', 'STEM', '2025-2026'),
(11, 'St. James', 'HUMSS', '2025-2026'),
(11, 'St. Timothy', 'HUMSS', '2025-2026'),
(11, 'St. Hannibal', 'TVL', '2025-2026'),
(11, 'St. Pio', 'ABM', '2025-2026');

-- Insert sample sections for Grade 12
INSERT INTO sections (grade_level, section_name, strand, school_year) VALUES
(12, 'St. Margaret', 'STEM', '2025-2026'),
(12, 'St. Martha', 'STEM', '2025-2026'),
(12, 'St. Rita of Casia', 'STEM', '2025-2026'),
(12, 'St. Philomena', 'HUMSS', '2025-2026'),
(12, 'St. Teresa de Avila', 'HUMSS', '2025-2026'),
(12, 'St. Agatha', 'TVL', '2025-2026'),
(12, 'St. Gertrude', 'ABM', '2025-2026');
