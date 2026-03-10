# SAO E-Record System - Implementation Guide

## Overview

This guide covers all the features implemented in the SAO E-Record Filing System, including database integration, authentication, file uploads, real-time notifications, and more.

## Table of Contents

1. [Database Setup](#database-setup)
2. [Authentication System](#authentication-system)
3. [File Upload System](#file-upload-system)
4. [Real-time Notifications](#real-time-notifications)
5. [API Endpoints](#api-endpoints)
6. [Frontend Integration](#frontend-integration)
7. [Security Features](#security-features)
8. [Activity Logging](#activity-logging)

## Database Setup

### Prerequisites
- MySQL 5.7+ or MariaDB 10.2+
- Node.js 14+
- npm or yarn

### Installation Steps

1. **Install MySQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   
   # macOS
   brew install mysql
   
   # Windows
   # Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=sao_erecord
   JWT_SECRET=your-secret-key-here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Database Setup**
   ```bash
   npm run db:setup
   ```

This will:
- Create the database
- Create all tables
- Insert default sections
- Create default SAO admin user

### Database Schema

The system includes 13 tables:


- **users** - Authentication and user accounts
- **students** - Student information and profiles
- **teachers** - Teacher information and profiles
- **parents** - Parent/guardian information
- **sections** - Class sections (42 sections total)
- **attendance_records** - Daily attendance tracking
- **violations** - Student violations and disciplinary records
- **excuse_slips** - Excuse slip submissions
- **appointments** - SAO appointments
- **notifications** - System notifications
- **activity_logs** - Audit trail of all actions
- **class_officers** - Class officer assignments
- **teacher_subjects** - Teacher-subject assignments

## Authentication System

### Features Implemented

1. **User Registration**
   - Student registration with parent information
   - Teacher registration with department details
   - Email verification
   - Password hashing with bcrypt

2. **Login/Logout**
   - JWT token-based authentication
   - Token expiration (7 days)
   - Role-based access control
   - Last login tracking

3. **Password Management**
   - Forgot password functionality
   - Password reset via email
   - Change password (authenticated users)
   - Secure token generation

### API Endpoints

```javascript
POST /api/auth/login
POST /api/auth/register/student
POST /api/auth/register/teacher
GET  /api/auth/me
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
```

### Frontend Integration Example

```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Redirect to dashboard
  }
}

// Make authenticated requests
async function fetchData(endpoint) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
}
```

## File Upload System

### Features

- Profile picture upload
- Excuse slip image upload
- Document uploads
- File validation (type, size)
- Secure file storage

### Configuration

- Max file size: 5MB
- Allowed types: JPEG, PNG, GIF, HEIC
- Storage: `uploads/` directory

### API Endpoints

```javascript
POST /api/upload/profile-picture
POST /api/upload/excuse-slip
POST /api/upload/document
```

### Usage Example

```javascript
async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/upload/profile-picture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}
```

## Real-time Notifications

### WebSocket Integration

The system uses Socket.IO for real-time notifications.

### Features

- Instant notification delivery
- User-specific notifications
- Role-based broadcasting
- Online status tracking
- Typing indicators

### Frontend Setup

```javascript
// Connect to WebSocket
const token = localStorage.getItem('token');
const socket = io('http://localhost:5000', {
  auth: { token }
});

// Listen for notifications
socket.on('new_notification', (notification) => {
  console.log('New notification:', notification);
  displayNotification(notification);
});

// Listen for appointment updates
socket.on('appointment_update', (appointment) => {
  console.log('Appointment updated:', appointment);
  updateAppointmentUI(appointment);
});

// Mark notification as read
socket.emit('mark_notification_read', notificationId);
```

## Activity Logging

All user actions are logged for audit purposes.

### Logged Actions

- Login/Logout
- Registration
- Password changes
- Data modifications
- File uploads
- Attendance marking
- Appointment booking

### Viewing Logs

```javascript
GET /api/activity-logs?userId=123&limit=50
GET /api/activity-logs/recent?limit=100
GET /api/activity-logs/action/:action
```

## Security Features

### Implemented

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Password strength requirements
   - Secure reset tokens

2. **JWT Authentication**
   - Token expiration
   - Role-based access
   - Token refresh mechanism

3. **File Upload Security**
   - File type validation
   - Size limits
   - Secure file naming
   - Path traversal prevention

4. **SQL Injection Prevention**
   - Parameterized queries
   - Input validation
   - Prepared statements

5. **Rate Limiting**
   - API request limits
   - Login attempt limits
   - DDoS protection

## Next Steps

1. Implement remaining API routes
2. Add parent portal
3. Integrate SMS notifications
4. Add report generation
5. Implement backup system
6. Add multi-language support
7. Create mobile app

## Support

For issues or questions, contact the development team.
