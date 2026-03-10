# SAO E-Record System - Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (MySQL)](#database-setup-mysql)
3. [Local Development Setup](#local-development-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [GitHub Setup](#github-setup)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Downloads & Installations

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git**
   - Download: https://git-scm.com/
   - Verify installation: `git --version`

3. **MySQL Database** (Choose ONE option):
   
   **Option A: Local MySQL (Development)**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/
   
   **Option B: Cloud MySQL (Production - RECOMMENDED)**
   - PlanetScale (Free tier): https://planetscale.com/
   - Railway (Free tier): https://railway.app/
   - Clever Cloud: https://www.clever-cloud.com/
   - Aiven (Free tier): https://aiven.io/

4. **Code Editor**
   - VS Code (Recommended): https://code.visualstudio.com/

---

## Database Setup (MySQL)

### Why MySQL (Not MongoDB)?

Your system is **already built with MySQL**. Here's why:
- ✅ All models use SQL queries
- ✅ Database schema is in SQL format
- ✅ Relational data structure (students, teachers, attendance, etc.)
- ✅ Better for structured educational data

**Do NOT install MongoDB** - it's incompatible with your current codebase.

### Setting Up MySQL

#### Option 1: PlanetScale (Recommended for Vercel)

1. Go to https://planetscale.com/ and sign up
2. Create a new database: `sao-erecord`
3. Get connection details:
   - Host
   - Username
   - Password
   - Database name
4. Copy the connection string (you'll need this for `.env`)

#### Option 2: Local MySQL

1. Install MySQL or XAMPP
2. Start MySQL service
3. Create database:
```sql
CREATE DATABASE sao_erecord;
```

---

## Local Development Setup

### Step 1: Clone/Download Project

```bash
# If using Git
git clone <your-repository-url>
cd sao-erecord-system

# Or download ZIP and extract
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (web server)
- mysql2 (database)
- bcrypt (password hashing)
- jsonwebtoken (authentication)
- socket.io (real-time notifications)
- nodemailer (email)
- multer (file uploads)
- helmet (security)
- And more...

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your details:
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Database (Update with your MySQL credentials)
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=sao_erecord

# JWT Secret (Generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Encryption Keys (Generate random strings)
ENCRYPTION_KEY=your-encryption-key-min-32-characters-long
HMAC_SECRET=your-hmac-secret-key-for-signatures

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Step 4: Setup Database

Run the database setup script:
```bash
npm run db:setup
```

This creates all tables (users, students, teachers, attendance, etc.)

### Step 5: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:5000

---

## Vercel Deployment

### Important Note
Vercel is designed for **serverless functions**, not traditional Node.js servers. Your current setup uses:
- Express server with WebSocket (Socket.IO)
- MySQL database connections
- File uploads

### Recommended Deployment Options

#### Option 1: Railway (BEST for your project)
- ✅ Supports full Node.js apps
- ✅ Built-in MySQL database
- ✅ WebSocket support
- ✅ Free tier available

**Steps:**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add MySQL database from Railway
6. Set environment variables
7. Deploy!

#### Option 2: Render
- ✅ Free tier for web services
- ✅ Supports WebSocket
- ✅ Easy deployment

**Steps:**
1. Go to https://render.com/
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables
8. Create service

#### Option 3: Heroku
- ✅ Traditional hosting
- ✅ Full Node.js support
- ⚠️ No longer has free tier

### If You Still Want Vercel

You'll need to:
1. Convert to serverless functions
2. Use external database (PlanetScale)
3. Remove Socket.IO or use external service
4. Use cloud storage for uploads (Cloudinary)

**This requires significant code changes.**

---

## GitHub Setup

### Step 1: Create Repository

1. Go to https://github.com/
2. Click "New repository"
3. Name: `sao-erecord-system`
4. Make it Private (recommended for school projects)
5. Don't initialize with README (you already have one)

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SAO E-Record System"

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/sao-erecord-system.git

# Push
git branch -M main
git push -u origin main
```

### Step 3: Protect Sensitive Files

Make sure `.gitignore` includes:
```
node_modules/
.env
uploads/
*.log
.DS_Store
```

**NEVER commit `.env` file to GitHub!**

---

## Environment Variables

### For Production Deployment

Set these in your hosting platform (Railway/Render/Heroku):

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app-url.com

# Database (from your hosting provider)
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=sao_erecord

# JWT Secret (generate new for production)
JWT_SECRET=production-secret-min-32-characters

# Encryption
ENCRYPTION_KEY=production-encryption-key-32-chars
HMAC_SECRET=production-hmac-secret-key

# Email
EMAIL_USER=your-school-email@gmail.com
EMAIL_PASS=your-app-password

# Security
ADMIN_IP_WHITELIST=your-school-ip
ENABLE_CSRF_PROTECTION=true
SESSION_TIMEOUT_MINUTES=30
```

### Gmail App Password Setup

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy 16-character password
6. Use in `EMAIL_PASS`

---

## Post-Deployment

### 1. Test Database Connection
Visit: `https://your-app.com/api/auth/test`

### 2. Create Admin Account
Use registration page or run SQL:
```sql
INSERT INTO users (email, password, role) 
VALUES ('admin@cccs.edu', 'hashed_password', 'sao');
```

### 3. Test Features
- ✅ Login/Registration
- ✅ Student Dashboard
- ✅ Teacher Dashboard
- ✅ SAO Dashboard
- ✅ Attendance tracking
- ✅ Appointments
- ✅ Notifications
- ✅ Email sending

### 4. Security Checklist
- [ ] Change all default passwords
- [ ] Update JWT_SECRET
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up backups
- [ ] Configure rate limiting
- [ ] Test file uploads
- [ ] Verify email sending

---

## Troubleshooting

### Database Connection Failed
- Check DB credentials in `.env`
- Verify MySQL is running
- Check firewall settings
- Test connection string

### Port Already in Use
```bash
# Change PORT in .env
PORT=3000
```

### Email Not Sending
- Verify Gmail App Password
- Check 2-Step Verification enabled
- Try different email service

### WebSocket Not Working
- Check CORS settings
- Verify server supports WebSocket
- Use Railway/Render instead of Vercel

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# Development
npm run dev

# Production
npm start
```

---

## Support & Resources

- Node.js Docs: https://nodejs.org/docs/
- MySQL Docs: https://dev.mysql.com/doc/
- Express Docs: https://expressjs.com/
- Socket.IO Docs: https://socket.io/docs/

---

## Summary

**What You Need:**
1. ✅ Node.js (NOT MongoDB)
2. ✅ MySQL Database
3. ✅ Git
4. ✅ GitHub account
5. ✅ Railway/Render account (for deployment)

**What You DON'T Need:**
- ❌ MongoDB
- ❌ Vercel (unless you want to refactor)

**Recommended Stack:**
- Frontend: Your HTML/CSS/JS files
- Backend: Node.js + Express
- Database: MySQL (PlanetScale or Railway)
- Hosting: Railway or Render
- Version Control: GitHub

Good luck with your deployment! 🚀
