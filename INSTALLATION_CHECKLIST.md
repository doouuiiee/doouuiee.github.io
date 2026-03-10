# Installation Checklist - SAO E-Record System

## 📋 Pre-Installation

### Downloads Required

- [ ] **Node.js** (v18+) from https://nodejs.org/
  - Verify: Open terminal and run `node --version`
  - Should show: v18.x.x or higher

- [ ] **MySQL** (Choose ONE):
  - [ ] Local MySQL from https://dev.mysql.com/downloads/
  - [ ] OR XAMPP from https://www.apachefriends.org/
  - [ ] OR Cloud MySQL (PlanetScale, Railway, Aiven)

- [ ] **Git** from https://git-scm.com/
  - Verify: Run `git --version`

- [ ] **Code Editor** (Optional)
  - VS Code from https://code.visualstudio.com/

### ❌ What NOT to Download
- [ ] ~~MongoDB~~ (System uses MySQL, not MongoDB)
- [ ] ~~Python~~ (Not needed)
- [ ] ~~PHP~~ (Not needed)

---

## 🚀 Installation Steps

### Step 1: Get the Code
```bash
# If using Git
git clone <your-repository-url>
cd sao-erecord-system

# OR download ZIP and extract
```
- [ ] Code downloaded/cloned
- [ ] Navigated to project folder

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] Command executed successfully
- [ ] No error messages
- [ ] `node_modules` folder created

**What gets installed:**
- express (web server)
- mysql2 (database driver)
- bcrypt (password hashing)
- jsonwebtoken (authentication)
- socket.io (real-time features)
- nodemailer (email)
- multer (file uploads)
- helmet (security)
- compression (performance)
- morgan (logging)
- cors (cross-origin)
- dotenv (environment variables)
- express-rate-limit (rate limiting)

### Step 3: Setup Environment
```bash
# Copy example file
cp .env.example .env

# OR on Windows
copy .env.example .env
```
- [ ] `.env` file created
- [ ] File opened in editor

**Edit `.env` with your details:**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Database credentials
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=sao_erecord

# Generate random 32+ character strings
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
ENCRYPTION_KEY=your-encryption-key-min-32-characters-long-random
HMAC_SECRET=your-hmac-secret-key-for-signatures-random-string

# Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password-16-chars
```

- [ ] PORT set (default: 5000)
- [ ] DB_HOST set (localhost or cloud URL)
- [ ] DB_USER set (usually 'root' for local)
- [ ] DB_PASS set (your MySQL password)
- [ ] DB_NAME set (sao_erecord)
- [ ] JWT_SECRET set (min 32 characters)
- [ ] ENCRYPTION_KEY set (min 32 characters)
- [ ] HMAC_SECRET set (min 32 characters)
- [ ] EMAIL_USER set (Gmail address)
- [ ] EMAIL_PASS set (Gmail app password)

### Step 4: Setup Gmail App Password

1. Go to https://myaccount.google.com/
2. Click "Security"
3. Enable "2-Step Verification"
4. Go to "App passwords"
5. Generate password for "Mail"
6. Copy 16-character password
7. Paste into `EMAIL_PASS` in `.env`

- [ ] 2-Step Verification enabled
- [ ] App password generated
- [ ] Password added to `.env`

### Step 5: Setup Database
```bash
npm run db:setup
```
- [ ] Command executed
- [ ] Database created
- [ ] Tables created (13 tables)
- [ ] No error messages

**Tables created:**
1. users
2. students
3. teachers
4. parents
5. sections
6. attendance
7. violations
8. appointments
9. notifications
10. documents
11. excuse_slips
12. activity_logs
13. sessions

### Step 6: Start Server
```bash
# Development mode (auto-reload)
npm run dev

# OR production mode
npm start
```
- [ ] Server started
- [ ] No error messages
- [ ] Shows: "Server running on port 5000"
- [ ] Shows: "Database connected"

### Step 7: Test in Browser
Open: http://localhost:5000

- [ ] Home page loads
- [ ] No console errors
- [ ] Login/Registration forms visible
- [ ] Dark mode toggle visible (bottom-right)

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Home page loads
- [ ] Registration form works
- [ ] Login form works
- [ ] Student dashboard accessible
- [ ] Teacher dashboard accessible
- [ ] SAO dashboard accessible
- [ ] SAO Management Center accessible
- [ ] Attendance sheet accessible

### New Features
- [ ] Dark mode toggle works (Ctrl+D)
- [ ] Dark mode preference saves
- [ ] Keyboard shortcuts work (press ?)
- [ ] Loading indicators show
- [ ] Export to PDF works (Ctrl+E)
- [ ] Print works (Ctrl+P)
- [ ] Search functionality works (Ctrl+F)

### Backend Features
- [ ] Database connection works
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens generated
- [ ] Email sending works (test)
- [ ] File upload works
- [ ] WebSocket connection works

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"
**Solution:**
```bash
npm install
```
- [ ] Resolved

### Issue: "Database connection failed"
**Check:**
- [ ] MySQL is running
- [ ] DB credentials in `.env` are correct
- [ ] Database `sao_erecord` exists
- [ ] User has permissions

**Solution:**
```bash
# Check MySQL status
# Windows: Check XAMPP or Services
# Mac/Linux: sudo systemctl status mysql

# Create database manually
mysql -u root -p
CREATE DATABASE sao_erecord;
exit;

# Run setup again
npm run db:setup
```
- [ ] Resolved

### Issue: "Port 5000 already in use"
**Solution:**
Change PORT in `.env`:
```env
PORT=3000
```
- [ ] Resolved

### Issue: "Email not sending"
**Check:**
- [ ] EMAIL_USER is correct
- [ ] EMAIL_PASS is app password (not regular password)
- [ ] 2-Step Verification enabled
- [ ] Gmail allows less secure apps

**Solution:**
1. Regenerate app password
2. Update `.env`
3. Restart server
- [ ] Resolved

### Issue: "npm: command not found"
**Solution:**
- [ ] Install Node.js from https://nodejs.org/
- [ ] Restart terminal
- [ ] Verify: `node --version`
- [ ] Resolved

### Issue: "mysql: command not found"
**Solution:**
- [ ] Install MySQL
- [ ] Add MySQL to PATH
- [ ] OR use cloud MySQL (PlanetScale)
- [ ] Resolved

---

## 📦 File Structure Check

Verify these files exist:

### Root Files
- [ ] `server.js`
- [ ] `package.json`
- [ ] `.env` (created by you)
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `DEPLOYMENT_GUIDE.md`
- [ ] `QUICK_START.md`
- [ ] `vercel.json`

### Config
- [ ] `config/database.js`

### Database
- [ ] `database/schema.sql`

### Models
- [ ] `models/User.js`
- [ ] `models/Student.js`
- [ ] `models/Teacher.js`
- [ ] `models/Parent.js`
- [ ] `models/Section.js`
- [ ] `models/Attendance.js`
- [ ] `models/Notification.js`

### Routes
- [ ] `routes/auth.js`
- [ ] `routes/students.js`
- [ ] `routes/teachers.js`
- [ ] `routes/attendance.js`
- [ ] `routes/appointments.js`
- [ ] `routes/notifications.js`
- [ ] `routes/upload.js`

### Middleware
- [ ] `middleware/auth.js`
- [ ] `middleware/security.js`
- [ ] `middleware/accessControl.js`
- [ ] `middleware/upload.js`

### Utils
- [ ] `utils/encryption.js`
- [ ] `utils/activityLogger.js`

### Services
- [ ] `services/socketService.js`

### Scripts
- [ ] `scripts/setupDatabase.js`

### Public
- [ ] `public/index.html`
- [ ] `public/student-dashboard.html`
- [ ] `public/teacher-dashboard.html`
- [ ] `public/sao-dashboard.html`
- [ ] `public/sao-management.html`
- [ ] `public/attendance-sheet.html`
- [ ] `public/manifest.json`
- [ ] `public/sw.js`

### Public CSS
- [ ] `public/css/dark-mode.css`

### Public JS
- [ ] `public/js/app.js`
- [ ] `public/js/utilities.js`
- [ ] `public/js/constants.js`
- [ ] `public/js/student-dashboard.js`
- [ ] `public/js/teacher-dashboard.js`
- [ ] `public/js/sao-dashboard.js`
- [ ] `public/js/sao-management.js`
- [ ] `public/js/attendance-sheet.js`
- [ ] `public/js/sectionData.js`

---

## ✅ Final Verification

### Development Environment
- [ ] Node.js installed and working
- [ ] MySQL installed and running
- [ ] Git installed
- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env` file configured
- [ ] Database setup completed
- [ ] Server starts without errors
- [ ] Application accessible at http://localhost:5000

### Features Working
- [ ] All pages load
- [ ] Dark mode works
- [ ] Keyboard shortcuts work
- [ ] Export to PDF works
- [ ] Database operations work
- [ ] Authentication works
- [ ] Email sending works (optional for dev)

### Ready for Next Steps
- [ ] Local development working
- [ ] Ready to create test accounts
- [ ] Ready to add content
- [ ] Ready to deploy (optional)

---

## 🎉 Success!

If all checkboxes are checked, your installation is complete!

### Next Steps:
1. Create admin account
2. Test all features
3. Customize branding
4. Add school data
5. Deploy to production (see DEPLOYMENT_GUIDE.md)

### Quick Commands:
```bash
# Start development server
npm run dev

# Start production server
npm start

# Setup database
npm run db:setup
```

---

## 📞 Need Help?

Check these files:
- `QUICK_START.md` - Quick setup guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `README.md` - Project overview
- `SECURITY_FEATURES.md` - Security details
- `.env.example` - Environment variables reference

---

**Installation Complete! 🚀**
