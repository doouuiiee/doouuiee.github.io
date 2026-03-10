# SAO E-Record Filing System

> A comprehensive Student Affairs Office E-Record Filing System for Cordova Catholic Cooperative School

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Security](#security)
- [Contributing](#contributing)

---

## ✨ Features

### 🎓 Student Dashboard
- View attendance records with charts
- Track 8 classes with schedules
- Submit excuse slips
- Book appointments with SAO
- View violations and warnings
- Real-time notifications
- Calendar integration
- Advanced search functionality

### 👨‍🏫 Teacher Dashboard
- Manage advisory class
- Track subjects taught
- View student masterlist
- Schedule appointments
- Monitor attendance
- Generate reports

### 🏢 SAO Dashboard
- Manage 42 sections (Grades 7-12)
- Real-time notifications
- Document management
- Generate reports
- Bulk operations
- Student lookup

### 🎯 SAO Management Center
- Real-time alert dashboard
- Attendance monitoring
- Appointment management
- Automated alert system (3x late, 5x late, 3x absent)
- Quick actions hub
- Bulk notifications

### 📊 Attendance Sheet
- Date/grade/section filters
- Print functionality
- Export to PDF/CSV
- Real-time updates

### 🌙 Modern UI Features
- **Dark Mode**: Toggle with Ctrl+D
- **Export to PDF**: Press Ctrl+E
- **Keyboard Shortcuts**: Full keyboard navigation
- **Loading Indicators**: Smooth loading states
- **PWA Support**: Install as mobile/desktop app
- **Responsive Design**: Works on all devices
- **Glass Morphism**: Modern UI design

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
npm run db:setup

# 4. Start development server
npm run dev

# 5. Open browser
# Visit: http://localhost:5000
```

See [QUICK_START.md](QUICK_START.md) for detailed instructions.

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS 3.x
- Chart.js 4.4.0
- Ionicons 7.1.0
- html2pdf.js

### Backend
- Node.js 18+
- Express.js 4.x
- MySQL 8.0
- Socket.IO (WebSocket)
- JWT Authentication

### Security
- Helmet.js (Security headers)
- bcrypt (Password hashing)
- AES-256-GCM encryption
- Rate limiting
- CSRF protection
- XSS prevention
- SQL injection prevention

### Email
- Nodemailer
- Gmail SMTP
- 6 email templates

### File Upload
- Multer
- Image validation
- Size limits

---

## 📦 Installation

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **MySQL** (v8.0 or higher)
   - Local: https://dev.mysql.com/downloads/
   - Cloud: PlanetScale, Railway, Aiven

3. **Git**
   - Download: https://git-scm.com/

### Install Steps

```bash
# Clone repository
git clone <your-repo-url>
cd sao-erecord-system

# Install dependencies
npm install

# This installs:
# - express, mysql2, bcrypt, jsonwebtoken
# - socket.io, nodemailer, multer
# - helmet, compression, morgan
# - cors, dotenv, express-rate-limit
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=sao_erecord

# JWT Secret (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Encryption Keys (min 32 characters)
ENCRYPTION_KEY=your-encryption-key-min-32-characters
HMAC_SECRET=your-hmac-secret-key-for-signatures

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Security
ADMIN_IP_WHITELIST=127.0.0.1,::1
ENABLE_CSRF_PROTECTION=true
SESSION_TIMEOUT_MINUTES=30
```

### Gmail Setup

1. Enable 2-Step Verification
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Copy 16-character password to `EMAIL_PASS`

### Database Setup

```bash
# Run setup script
npm run db:setup

# This creates:
# - 13 tables (users, students, teachers, etc.)
# - Indexes for performance
# - Foreign key constraints
```

---

## 🎮 Usage

### Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Access Dashboards

- **Home/Login**: http://localhost:5000
- **Student Dashboard**: http://localhost:5000/student-dashboard.html
- **Teacher Dashboard**: http://localhost:5000/teacher-dashboard.html
- **SAO Dashboard**: http://localhost:5000/sao-dashboard.html
- **SAO Management**: http://localhost:5000/sao-management.html
- **Attendance Sheet**: http://localhost:5000/attendance-sheet.html

### Keyboard Shortcuts

- `Ctrl+D`: Toggle Dark Mode
- `Ctrl+P`: Print Page
- `Ctrl+E`: Export to PDF
- `Ctrl+F`: Focus Search
- `Ctrl+H`: Go Home
- `Escape`: Close Modals
- `?`: Show Shortcuts Help

---

## 🚀 Deployment

### Recommended Platforms

#### 1. Railway (Best for this project)
- ✅ Full Node.js support
- ✅ Built-in MySQL
- ✅ WebSocket support
- ✅ Free tier

```bash
# Deploy to Railway
1. Go to https://railway.app/
2. Connect GitHub repository
3. Add MySQL database
4. Set environment variables
5. Deploy!
```

#### 2. Render
- ✅ Free tier
- ✅ WebSocket support
- ✅ Easy deployment

```bash
# Deploy to Render
1. Go to https://render.com/
2. New Web Service
3. Connect repository
4. Build: npm install
5. Start: npm start
```

#### 3. Heroku
- ✅ Traditional hosting
- ⚠️ No free tier

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Database Hosting

- **PlanetScale**: https://planetscale.com/ (Free tier)
- **Railway**: https://railway.app/ (Built-in MySQL)
- **Aiven**: https://aiven.io/ (Free tier)
- **Clever Cloud**: https://www.clever-cloud.com/

---

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get started in 5 minutes
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Security Features](SECURITY_FEATURES.md) - 15-layer security system
- [Violations Reference](VIOLATIONS_REFERENCE.md) - 9 violation types
- [SAO Management Center](SAO_MANAGEMENT_CENTER.md) - Management hub guide
- [Features Implemented](FEATURES_IMPLEMENTED.md) - Complete feature list
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions

---

## 🔐 Security

### 15-Layer Security System

1. ✅ JWT Authentication (7-day expiration)
2. ✅ Role-Based Access Control (4 roles, 30+ permissions)
3. ✅ AES-256-GCM Data Encryption
4. ✅ XSS Prevention & Input Sanitization
5. ✅ SQL Injection Prevention
6. ✅ Rate Limiting (API, Auth, Upload)
7. ✅ Security Headers (Helmet.js)
8. ✅ CSRF Protection
9. ✅ Session Management (30-min timeout)
10. ✅ Access Control Middleware
11. ✅ File Upload Security
12. ✅ Comprehensive Audit Logging
13. ✅ Password Security (bcrypt)
14. ✅ IP Whitelisting
15. ✅ Data Masking

See [SECURITY_FEATURES.md](SECURITY_FEATURES.md) for details.

---

## 🎨 Color Palettes

### Dashboard Palette (Old)
- Primary: `#354024`
- Secondary: `#4c3d19`
- Accent: `#889063`
- Light: `#cfbb99`
- Lighter: `#e5d7c4`

### Login/Registration Palette (New)
- Primary: `#79864b`
- Secondary: `#eee9bf`
- Accent: `#bdb77c`
- Dark: `#78793f`
- Medium: `#8a7d4c`

---

## 📊 Database Schema

### Tables (13)
- `users` - User accounts
- `students` - Student profiles
- `teachers` - Teacher profiles
- `parents` - Parent information
- `sections` - Class sections
- `attendance` - Attendance records
- `violations` - Violation records
- `appointments` - Appointment bookings
- `notifications` - System notifications
- `documents` - Document requests
- `excuse_slips` - Excuse slip submissions
- `activity_logs` - Audit trail
- `sessions` - User sessions

---

## 🤝 Contributing

This is a school project for Cordova Catholic Cooperative School. For contributions or suggestions, please contact the development team.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Credits

**Developed for**: Cordova Catholic Cooperative School
**Project**: SAO E-Record Filing System
**Version**: 1.0.0
**Year**: 2024

---

## 🆘 Support

For issues or questions:
1. Check documentation files
2. Review `.env.example` for configuration
3. Check `database/schema.sql` for database structure
4. Review `server.js` for API endpoints

---

## 🎯 Roadmap

- [x] Student Dashboard
- [x] Teacher Dashboard
- [x] SAO Dashboard
- [x] SAO Management Center
- [x] Attendance System
- [x] Appointment System
- [x] Notification System
- [x] Email Integration
- [x] Security Features
- [x] Dark Mode
- [x] Export to PDF
- [x] PWA Support
- [ ] Mobile App (React Native)
- [ ] SMS Notifications
- [ ] Advanced Analytics
- [ ] Parent Portal

---

## 📞 Contact

For more information about Cordova Catholic Cooperative School, visit the school website or contact the SAO office.

---

**Made with ❤️ for CCCS**
