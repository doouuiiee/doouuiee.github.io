// ============================================
// AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { verifyToken } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

// Generate JWT token
function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ============================================
// LOGIN
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact the administrator.'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.role);

    // Get additional user data based on role
    let userData = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    if (user.role === 'student') {
      const student = await Student.findByUserId(user.id);
      userData.student = student;
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findByUserId(user.id);
      userData.teacher = teacher;
    }

    // Log activity
    await logActivity(user.id, 'login', null, null, 'User logged in', req.ip, req.get('user-agent'));

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// ============================================
// REGISTER STUDENT
// ============================================
router.post('/register/student', async (req, res) => {
  try {
    const {
      email, password, lrn, firstName, middleName, lastName, gender,
      birthDate, contactNumber, gradeLevel, section, strand,
      parentName, parentRelationship, parentContact, parentEmail, parentAddress
    } = req.body;

    // Validate required fields
    if (!email || !password || !lrn || !firstName || !lastName || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if LRN already exists
    const existingStudent = await Student.findByLRN(lrn);
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'LRN already registered'
      });
    }

    // Create user account
    const userId = await User.create({
      email,
      password,
      role: 'student'
    });

    // Create parent record
    const Parent = require('../models/Parent');
    const parentId = await Parent.create({
      fullName: parentName,
      relationship: parentRelationship || 'guardian',
      contactNumber: parentContact,
      email: parentEmail,
      homeAddress: parentAddress
    });

    // Find or create section
    const Section = require('../models/Section');
    let sectionRecord = await Section.findByGradeAndName(gradeLevel, section);
    
    // If section doesn't exist, create it
    if (!sectionRecord) {
      const sectionId = await Section.create({
        gradeLevel,
        sectionName: section,
        strand: strand || 'N/A',
        schoolYear: '2025-2026'
      });
      sectionRecord = await Section.findById(sectionId);
    }

    // Create student record
    const studentId = await Student.create({
      userId: userId,
      lrn,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth: birthDate,
      contactNumber,
      address: parentAddress || 'N/A',
      gradeLevel,
      sectionId: sectionRecord._id,
      parentId: parentId
    });

    // Send registration email (disabled for now - use email routes in server.js)
    // const emailService = require('../services/emailService');
    // await emailService.sendRegistrationEmail({
    //   to: email,
    //   name: `${firstName} ${lastName}`,
    //   role: 'Student',
    //   lrn,
    //   gradeLevel,
    //   section
    // });

    // Log activity
    await logActivity(userId, 'register', 'student', studentId, 'Student registered', req.ip, req.get('user-agent'));

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email.',
      userId,
      studentId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// ============================================
// REGISTER TEACHER
// ============================================
router.post('/register/teacher', async (req, res) => {
  try {
    const {
      email, password, employeeId, firstName, middleName, lastName, gender,
      contactNumber, department, position, advisorySection
    } = req.body;

    // Validate required fields
    if (!email || !password || !employeeId || !firstName || !lastName || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user account
    const userId = await User.create({
      email,
      password,
      role: 'teacher'
    });

    // Find or create advisory section if provided
    let advisorySectionId = null;
    if (advisorySection) {
      const Section = require('../models/Section');
      let sectionRecord = await Section.findByName(advisorySection);
      
      // If section doesn't exist, create a placeholder
      if (!sectionRecord) {
        const sectionId = await Section.create({
          gradeLevel: 11, // Default grade level
          sectionName: advisorySection,
          strand: 'N/A',
          schoolYear: '2025-2026'
        });
        sectionRecord = await Section.findById(sectionId);
      }
      advisorySectionId = sectionRecord._id;
    }

    // Create teacher record
    const Teacher = require('../models/Teacher');
    const teacherId = await Teacher.create({
      userId: userId,
      employeeId,
      firstName,
      middleName,
      lastName,
      gender,
      contactNumber,
      email,
      department,
      position,
      advisorySectionId: advisorySectionId
    });

    // Send registration email (disabled for now - use email routes in server.js)
    // const emailService = require('../services/emailService');
    // await emailService.sendRegistrationEmail({
    //   to: email,
    //   name: `${firstName} ${lastName}`,
    //   role: 'Teacher',
    //   employeeId,
    //   department,
    //   position
    // });

    // Log activity
    await logActivity(userId, 'register', 'teacher', teacherId, 'Teacher registered', req.ip, req.get('user-agent'));

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email.',
      userId,
      teacherId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// ============================================
// GET CURRENT USER
// ============================================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    
    let userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      lastLogin: user.last_login
    };

    if (user.role === 'student') {
      const student = await Student.findByUserId(user.id);
      userData.student = student;
    } else if (user.role === 'teacher') {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findByUserId(user.id);
      userData.teacher = teacher;
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

// ============================================
// LOGOUT
// ============================================
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Log activity
    await logActivity(req.user.id, 'logout', null, null, 'User logged out', req.ip, req.get('user-agent'));

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// ============================================
// REQUEST PASSWORD RESET
// ============================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent.'
      });
    }

    const resetToken = await User.generateResetToken(email);

    // Send reset email (disabled for now - use email routes in server.js)
    // const emailService = require('../services/emailService');
    // await emailService.sendPasswordResetEmail({
    //   to: email,
    //   resetToken,
    //   resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    // });

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
});

// ============================================
// RESET PASSWORD
// ============================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    const user = await User.verifyResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    await User.updatePassword(user.id, newPassword);
    await User.clearResetToken(user.id);

    // Log activity
    await logActivity(user.id, 'password_reset', null, null, 'Password reset successful', req.ip, req.get('user-agent'));

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// ============================================
// CHANGE PASSWORD
// ============================================
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    const user = await User.findByEmail(req.user.email);
    const isValidPassword = await User.verifyPassword(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    await User.updatePassword(req.user.id, newPassword);

    // Log activity
    await logActivity(req.user.id, 'password_change', null, null, 'Password changed', req.ip, req.get('user-agent'));

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;
