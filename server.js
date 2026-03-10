// ============================================
// SAO E-RECORD FILING SYSTEM - Backend Server
// ============================================

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Database connection
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Socket.IO initialization
const socketService = require('./services/socketService');
socketService.initializeSocket(server);

// Security middleware
const {
  apiLimiter,
  securityHeaders,
  sanitizeBody,
  sanitizeQuery,
  preventSQLInjection
} = require('./middleware/security');

// Apply security headers
app.use(securityHeaders);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Compression
app.use(compression());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization middleware
app.use(sanitizeBody);
app.use(sanitizeQuery);
app.use(preventSQLInjection);

// Rate limiting
app.use('/api/', apiLimiter);

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const attendanceRoutes = require('./routes/attendance');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Email transporter configuration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = require('./email-templates');

// ============================================
// EMAIL ROUTES
// ============================================

// 1. Registration Confirmation Email
app.post('/api/email/registration', async (req, res) => {
  try {
    const { to, name, role, lrn, gradeLevel, section } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Registration Successful - SAO E-Record System',
      html: emailTemplates.registrationConfirmation(name, role, lrn, gradeLevel, section)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Registration email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// 2. Appointment Confirmation Email
app.post('/api/email/appointment-confirmation', async (req, res) => {
  try {
    const { to, name, date, time, purpose, type, matter } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Appointment Confirmed - SAO Office',
      html: emailTemplates.appointmentConfirmation(name, date, time, purpose, type, matter)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Appointment confirmation sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// 3. Document Ready Email
app.post('/api/email/document-ready', async (req, res) => {
  try {
    const { to, name, documentType, pickupDate } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Document Ready for Pickup - SAO Office',
      html: emailTemplates.documentReady(name, documentType, pickupDate)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Document ready notification sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// 4. Violation Notice Email
app.post('/api/email/violation-notice', async (req, res) => {
  try {
    const { to, studentName, parentName, violationType, date, description, action } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Violation Notice - SAO Office',
      html: emailTemplates.violationNotice(studentName, parentName, violationType, date, description, action)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Violation notice sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// 5. Attendance Warning Email
app.post('/api/email/attendance-warning', async (req, res) => {
  try {
    const { to, studentName, parentName, warningType, count, details } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Attendance Warning - SAO Office',
      html: emailTemplates.attendanceWarning(studentName, parentName, warningType, count, details)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Attendance warning sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// 6. General Notification Email
app.post('/api/email/notification', async (req, res) => {
  try {
    const { to, name, subject, message, priority } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: subject || 'Notification from SAO Office',
      html: emailTemplates.generalNotification(name, message, priority)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// ============================================
// START SERVER
// ============================================

async function startServer() {
  // Connect to MongoDB
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error('Failed to connect to MongoDB. Please check your configuration.');
    console.log('Server starting without database connection...');
  }

  server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`SAO E-Record System Server`);
    console.log('='.repeat(50));
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Frontend URL: http://localhost:${PORT}`);
    console.log(`✓ API URL: http://localhost:${PORT}/api`);
    console.log(`✓ WebSocket: Enabled`);
    console.log(`✓ Database: MongoDB`);
    console.log('='.repeat(50));
  });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
