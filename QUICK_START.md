# SAO E-Record System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Node.js
Download and install from: https://nodejs.org/ (v18 or higher)

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
# Minimum required:
# - DB_HOST=localhost
# - DB_USER=root
# - DB_PASS=your_password
# - DB_NAME=sao_erecord
# - JWT_SECRET=your-secret-key-min-32-chars
```

### Step 4: Setup Database
```bash
npm run db:setup
```

### Step 5: Start Server
```bash
npm run dev
```

Visit: http://localhost:5000

---

## 📦 What's Included

### Features
✅ Student Dashboard (attendance, classes, appointments, violations)
✅ Teacher Dashboard (advisory class, subjects, masterlist)
✅ SAO Dashboard (42 sections, notifications, reports)
✅ SAO Management Center (real-time alerts, attendance monitor)
✅ Attendance Sheet (print/export functionality)
✅ Dark Mode Toggle
✅ Export to PDF
✅ Keyboard Shortcuts (Ctrl+D, Ctrl+P, Ctrl+E)
✅ Real-time Notifications (WebSocket)
✅ Email System (6 templates)
✅ Security Features (JWT, encryption, rate limiting)
✅ PWA Support (offline mode)

### Tech Stack
- Frontend: HTML, Tailwind CSS, JavaScript, Chart.js
- Backend: Node.js, Express
- Database: MySQL
- Real-time: Socket.IO
- Email: Nodemailer
- Security: Helmet, bcrypt, JWT

---

## 🎨 New Features (Just Added!)

### 1. Dark Mode
- Toggle button (bottom-right corner)
- Saves preference to localStorage
- Smooth transitions

### 2. Export to PDF
- Press Ctrl+E or use export button
- Exports current page to PDF
- Includes all charts and data

### 3. Keyboard Shortcuts
- Ctrl+D: Toggle Dark Mode
- Ctrl+P: Print Page
- Ctrl+E: Export to PDF
- Ctrl+F: Focus Search
- Ctrl+H: Go Home
- ?: Show Shortcuts Help

### 4. Loading Indicators
- Shows during API calls
- Smooth animations
- Auto-hides on completion

### 5. PWA (Progressive Web App)
- Install on mobile/desktop
- Offline support
- App-like experience

---

## 📱 Mobile Support

The system is fully responsive and can be installed as a PWA:

1. Open in Chrome/Edge
2. Click "Install" prompt
3. Use like a native app

---

## 🔐 Default Accounts

After setup, create accounts via registration page or use SQL:

```sql
-- Create SAO admin account
INSERT INTO users (email, password, role) 
VALUES ('admin@cccs.edu', 'hashed_password', 'sao');
```

---

## 🛠️ Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

### Port Already in Use
Change PORT in .env:
```env
PORT=3000
```

### Email Not Sending
- Enable Gmail 2-Step Verification
- Generate App Password
- Update EMAIL_PASS in .env

---

## 📚 Documentation

- [Complete Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Security Features](SECURITY_FEATURES.md)
- [Violations Reference](VIOLATIONS_REFERENCE.md)
- [SAO Management Center](SAO_MANAGEMENT_CENTER.md)
- [Features Implemented](FEATURES_IMPLEMENTED.md)

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Configure environment
4. ✅ Start server
5. 📝 Create admin account
6. 🎨 Customize colors/branding
7. 📧 Configure email
8. 🚀 Deploy to production

---

## 💡 Tips

- Use dark mode for better eye comfort
- Press ? to see all keyboard shortcuts
- Export reports to PDF for records
- Check SAO Management Center for alerts
- Enable notifications for real-time updates

---

## 🆘 Need Help?

Check the documentation files or review:
- Database schema: `database/schema.sql`
- Server config: `server.js`
- Environment variables: `.env.example`

---

## 🎉 You're All Set!

Your SAO E-Record System is ready to use. Enjoy! 🚀
