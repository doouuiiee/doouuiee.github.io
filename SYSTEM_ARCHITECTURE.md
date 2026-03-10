# System Architecture - SAO E-Record System

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Student    │  │   Teacher    │  │     SAO      │    │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │     SAO      │  │  Attendance  │  │    Login/    │    │
│  │  Management  │  │    Sheet     │  │ Registration │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  Features: Dark Mode, PWA, Keyboard Shortcuts, PDF Export  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Express.js Server                      │  │
│  │                 (server.js)                         │  │
│  └─────────────────────────────────────────────────────┘  │
│                            ↕                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Middleware  │  │    Routes    │  │   Services   │    │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│  │ • Auth       │  │ • Students   │  │ • Socket.IO  │    │
│  │ • Security   │  │ • Teachers   │  │ • Email      │    │
│  │ • Upload     │  │ • Attendance │  │ • Logger     │    │
│  │ • Access     │  │ • Appoint.   │  │              │    │
│  │   Control    │  │ • Notif.     │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                            ↕                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Models                           │  │
│  │  User • Student • Teacher • Parent • Section        │  │
│  │  Attendance • Notification • Violation              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↕ MySQL
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    users     │  │   students   │  │   teachers   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  attendance  │  │ appointments │  │ notifications│    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  violations  │  │   sections   │  │   parents    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  documents   │  │ excuse_slips │  │activity_logs │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│                    13 Tables Total                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
sao-erecord-system/
│
├── 📄 server.js                    # Main server file
├── 📄 package.json                 # Dependencies
├── 📄 .env                         # Configuration (create this)
├── 📄 .env.example                 # Configuration template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 vercel.json                  # Vercel config
│
├── 📚 Documentation/
│   ├── README.md                   # Project overview
│   ├── START_HERE.md               # Quick navigation
│   ├── QUICK_START.md              # 5-minute setup
│   ├── INSTALLATION_CHECKLIST.md   # Step-by-step install
│   ├── DEPLOYMENT_GUIDE.md         # Deploy to production
│   ├── PWA_SETUP.md                # PWA icon setup
│   ├── WHATS_NEW.md                # Latest updates
│   ├── SYSTEM_ARCHITECTURE.md      # This file
│   ├── SECURITY_FEATURES.md        # Security details
│   ├── VIOLATIONS_REFERENCE.md     # Violation types
│   └── SAO_MANAGEMENT_CENTER.md    # Management guide
│
├── 📁 config/
│   └── database.js                 # Database connection
│
├── 📁 database/
│   └── schema.sql                  # Database structure
│
├── 📁 middleware/
│   ├── auth.js                     # Authentication
│   ├── security.js                 # Security middleware
│   ├── accessControl.js            # Access control
│   └── upload.js                   # File upload
│
├── 📁 models/
│   ├── User.js                     # User model
│   ├── Student.js                  # Student model
│   ├── Teacher.js                  # Teacher model
│   ├── Parent.js                   # Parent model
│   ├── Section.js                  # Section model
│   ├── Attendance.js               # Attendance model
│   └── Notification.js             # Notification model
│
├── 📁 routes/
│   ├── auth.js                     # Auth routes
│   ├── students.js                 # Student routes
│   ├── teachers.js                 # Teacher routes
│   ├── attendance.js               # Attendance routes
│   ├── appointments.js             # Appointment routes
│   ├── notifications.js            # Notification routes
│   └── upload.js                   # Upload routes
│
├── 📁 services/
│   └── socketService.js            # WebSocket service
│
├── 📁 utils/
│   ├── encryption.js               # Encryption utilities
│   └── activityLogger.js           # Activity logging
│
├── 📁 scripts/
│   └── setupDatabase.js            # Database setup script
│
└── 📁 public/                      # Frontend files
    ├── index.html                  # Login/Registration
    ├── student-dashboard.html      # Student portal
    ├── teacher-dashboard.html      # Teacher portal
    ├── sao-dashboard.html          # SAO portal
    ├── sao-management.html         # Management center
    ├── attendance-sheet.html       # Attendance tracking
    ├── manifest.json               # PWA manifest
    ├── sw.js                       # Service worker
    │
    ├── 📁 css/
    │   └── dark-mode.css           # Dark mode styles
    │
    └── 📁 js/
        ├── app.js                  # Login/Registration logic
        ├── utilities.js            # Utility functions
        ├── constants.js            # Constants & violations
        ├── student-dashboard.js    # Student logic
        ├── teacher-dashboard.js    # Teacher logic
        ├── sao-dashboard.js        # SAO logic
        ├── sao-management.js       # Management logic
        ├── attendance-sheet.js     # Attendance logic
        └── sectionData.js          # Section data
```

---

## 🔄 Data Flow

### 1. User Authentication Flow
```
User Login
    ↓
Frontend (index.html)
    ↓
POST /api/auth/login
    ↓
Auth Middleware (validate)
    ↓
User Model (check credentials)
    ↓
Generate JWT Token
    ↓
Return token + user data
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### 2. Attendance Recording Flow
```
Teacher marks attendance
    ↓
Frontend (teacher-dashboard.html)
    ↓
POST /api/attendance
    ↓
Auth Middleware (verify token)
    ↓
Access Control (check role)
    ↓
Attendance Model (save to DB)
    ↓
Activity Logger (log action)
    ↓
Socket.IO (notify SAO)
    ↓
Email Service (if threshold met)
    ↓
Return success
    ↓
Update UI
```

### 3. Real-time Notification Flow
```
Event occurs (e.g., new violation)
    ↓
Backend creates notification
    ↓
Save to notifications table
    ↓
Socket.IO emits event
    ↓
All connected clients receive
    ↓
Frontend updates notification badge
    ↓
User clicks notification
    ↓
Mark as read in database
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         15-Layer Security System        │
├─────────────────────────────────────────┤
│                                         │
│  1. JWT Authentication                  │
│     ↓                                   │
│  2. Role-Based Access Control           │
│     ↓                                   │
│  3. AES-256-GCM Encryption              │
│     ↓                                   │
│  4. XSS Prevention                      │
│     ↓                                   │
│  5. SQL Injection Prevention            │
│     ↓                                   │
│  6. Rate Limiting                       │
│     ↓                                   │
│  7. Security Headers (Helmet)           │
│     ↓                                   │
│  8. CSRF Protection                     │
│     ↓                                   │
│  9. Session Management                  │
│     ↓                                   │
│  10. Access Control Middleware          │
│     ↓                                   │
│  11. File Upload Security               │
│     ↓                                   │
│  12. Audit Logging                      │
│     ↓                                   │
│  13. Password Security (bcrypt)         │
│     ↓                                   │
│  14. IP Whitelisting                    │
│     ↓                                   │
│  15. Data Masking                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture

### Component Structure
```
┌─────────────────────────────────────────┐
│           HTML Pages (6)                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Common Components              │   │
│  ├─────────────────────────────────┤   │
│  │  • Navigation Bar               │   │
│  │  • Dark Mode Toggle             │   │
│  │  • Search Bar                   │   │
│  │  • Notification Badge           │   │
│  │  • Loading Overlay              │   │
│  │  • Modals                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Page-Specific Components       │   │
│  ├─────────────────────────────────┤   │
│  │  • Dashboard Cards              │   │
│  │  • Charts (Chart.js)            │   │
│  │  • Tables                       │   │
│  │  • Forms                        │   │
│  │  • Calendars                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Utilities                      │   │
│  ├─────────────────────────────────┤   │
│  │  • Dark Mode                    │   │
│  │  • PDF Export                   │   │
│  │  • Keyboard Shortcuts           │   │
│  │  • Data Export (CSV/JSON)       │   │
│  │  • Notifications                │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables
```
users
├── id (PK)
├── email
├── password (hashed)
├── role (student/teacher/sao/parent)
├── created_at
└── updated_at

students
├── id (PK)
├── user_id (FK → users)
├── lrn
├── first_name
├── last_name
├── grade_level
├── section_id (FK → sections)
└── ...

teachers
├── id (PK)
├── user_id (FK → users)
├── employee_id
├── first_name
├── last_name
├── advisory_section_id (FK → sections)
└── ...

attendance
├── id (PK)
├── student_id (FK → students)
├── date
├── status (present/absent/late/excused)
├── remarks
└── recorded_by (FK → users)

violations
├── id (PK)
├── student_id (FK → students)
├── type
├── description
├── severity
├── date
└── reported_by (FK → users)

appointments
├── id (PK)
├── student_id (FK → students)
├── date
├── time
├── purpose
├── status (pending/approved/completed)
└── ...
```

### Relationships
```
users (1) ──→ (1) students
users (1) ──→ (1) teachers
users (1) ──→ (1) parents

students (N) ──→ (1) sections
students (1) ──→ (N) attendance
students (1) ──→ (N) violations
students (1) ──→ (N) appointments

teachers (1) ──→ (1) sections (advisory)
teachers (1) ──→ (N) attendance (recorded)
```

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── Node.js Server (localhost:5000)
├── MySQL Database (localhost:3306)
└── Frontend Files (served by Express)
```

### Production (Railway/Render)
```
Cloud Platform
├── Web Service
│   ├── Node.js Server
│   ├── Express.js
│   └── Static Files
│
├── MySQL Database
│   ├── Managed Database
│   └── Automatic Backups
│
├── Environment Variables
│   ├── Secrets
│   └── Configuration
│
└── HTTPS/SSL
    └── Automatic Certificate
```

---

## 📊 Technology Stack

### Frontend
```
┌─────────────────────────────────────┐
│  HTML5 + CSS3 + JavaScript (ES6+)  │
├─────────────────────────────────────┤
│  • Tailwind CSS (styling)          │
│  • Chart.js (charts)               │
│  • Ionicons (icons)                │
│  • html2pdf.js (PDF export)        │
│  • Service Worker (PWA)            │
└─────────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────────┐
│  Node.js + Express.js              │
├─────────────────────────────────────┤
│  • MySQL2 (database)               │
│  • Socket.IO (WebSocket)           │
│  • JWT (authentication)            │
│  • bcrypt (password hashing)       │
│  • Nodemailer (email)              │
│  • Multer (file upload)            │
│  • Helmet (security)               │
│  • Morgan (logging)                │
└─────────────────────────────────────┘
```

### Database
```
┌─────────────────────────────────────┐
│  MySQL 8.0                         │
├─────────────────────────────────────┤
│  • 13 Tables                       │
│  • Foreign Keys                    │
│  • Indexes                         │
│  • Transactions                    │
└─────────────────────────────────────┘
```

---

## 🔄 Request/Response Cycle

### Example: Get Student Attendance
```
1. User clicks "View Attendance"
   ↓
2. Frontend sends GET request
   GET /api/attendance/student/123
   Headers: { Authorization: "Bearer <token>" }
   ↓
3. Server receives request
   ↓
4. Auth Middleware validates JWT
   ↓
5. Access Control checks permissions
   ↓
6. Route handler processes request
   ↓
7. Attendance Model queries database
   SELECT * FROM attendance WHERE student_id = 123
   ↓
8. Database returns results
   ↓
9. Model formats data
   ↓
10. Server sends response
    { success: true, data: [...] }
    ↓
11. Frontend receives data
    ↓
12. JavaScript updates UI
    ↓
13. User sees attendance records
```

---

## 🎯 Key Features by Layer

### Presentation Layer (Frontend)
- 6 responsive dashboards
- Dark mode
- Charts and graphs
- Real-time updates
- PWA support
- Keyboard shortcuts
- PDF export

### Application Layer (Backend)
- RESTful API
- WebSocket server
- Email service
- File upload
- Authentication
- Authorization
- Logging

### Data Layer (Database)
- User management
- Student records
- Attendance tracking
- Violation records
- Appointment scheduling
- Notification system
- Audit trail

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
POST   /api/auth/logout        # Logout user
POST   /api/auth/reset-password # Reset password
```

### Students
```
GET    /api/students           # Get all students
GET    /api/students/:id       # Get student by ID
PUT    /api/students/:id       # Update student
```

### Attendance
```
POST   /api/attendance         # Record attendance
GET    /api/attendance/student/:id  # Get by student
GET    /api/attendance/range   # Get by date range
```

### Appointments
```
POST   /api/appointments       # Create appointment
GET    /api/appointments       # Get appointments
PATCH  /api/appointments/:id   # Update status
```

### Notifications
```
GET    /api/notifications      # Get notifications
PATCH  /api/notifications/:id/read  # Mark as read
POST   /api/notifications      # Create notification
```

---

## 📱 PWA Architecture

```
┌─────────────────────────────────────┐
│         Progressive Web App         │
├─────────────────────────────────────┤
│                                     │
│  manifest.json                      │
│  ├── App name                       │
│  ├── Icons                          │
│  ├── Theme colors                   │
│  └── Display mode                   │
│                                     │
│  Service Worker (sw.js)             │
│  ├── Cache static files             │
│  ├── Offline support                │
│  ├── Background sync                │
│  └── Push notifications (ready)     │
│                                     │
│  Features                           │
│  ├── Install on home screen         │
│  ├── Works offline                  │
│  ├── Fast loading                   │
│  └── App-like experience            │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎉 Summary

This system is a full-stack web application with:
- **6 frontend pages** (HTML/CSS/JS)
- **7 backend routes** (Express.js)
- **13 database tables** (MySQL)
- **15 security layers**
- **PWA support**
- **Real-time features** (WebSocket)
- **Email integration**
- **Complete documentation**

Everything is modular, scalable, and production-ready! 🚀
