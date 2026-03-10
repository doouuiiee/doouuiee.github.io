# Quick Setup Guide - SAO E-Record System

## Step-by-Step Installation

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Recommended: LTS version (v18 or higher)
- Verify installation: `node --version` and `npm --version`

### 2. Project Setup
```bash
# Navigate to project directory
cd sao-erecord-system

# Install all dependencies
npm install
```

### 3. Email Configuration

#### Option A: Using Gmail (Recommended)

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification" and follow the setup

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "SAO E-Record System"
   - Copy the 16-character password

3. **Configure .env file**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file
   nano .env  # or use any text editor
   ```
   
   Add your credentials:
   ```
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-character app password
   ```

#### Option B: Using Other Email Services

For Outlook/Hotmail:
```
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```
Update `server.js` line 16:
```javascript
service: 'outlook'  // instead of 'gmail'
```

For custom SMTP:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
SAO E-Record System server running on port 5000
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## Testing Email Functionality

### Test Registration Email
```bash
curl -X POST http://localhost:5000/api/email/registration \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@email.com",
    "name": "Juan Dela Cruz",
    "role": "Student",
    "lrn": "2024120001",
    "gradeLevel": "Grade 12",
    "section": "St. Margaret"
  }'
```

### Test Appointment Confirmation
```bash
curl -X POST http://localhost:5000/api/email/appointment-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@email.com",
    "name": "Juan Dela Cruz",
    "date": "2026-03-15",
    "time": "10:00 AM",
    "type": "Violation",
    "matter": "Academic Dishonesty"
  }'
```

## Troubleshooting

### Email Not Sending

**Problem:** "Invalid login" error
- **Solution:** Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled

**Problem:** "Connection timeout"
- **Solution:** Check your internet connection
- Try disabling antivirus/firewall temporarily
- Verify SMTP settings

**Problem:** Emails going to spam
- **Solution:** Add sender to contacts
- Check email content for spam triggers
- Consider using a custom domain email

### Server Issues

**Problem:** Port 5000 already in use
- **Solution:** Change PORT in .env file to another port (e.g., 3000, 8080)

**Problem:** Module not found
- **Solution:** Run `npm install` again
- Delete `node_modules` folder and run `npm install`

**Problem:** Cannot find .env file
- **Solution:** Make sure you copied `.env.example` to `.env`
- Check file is in root directory

## Default Credentials (Sample Data)

### Student Login
- LRN: 2024120001
- Password: student123

### Teacher Login
- Email: teacher@cccs.edu
- Password: teacher123

### SAO Login
- Email: sao@cccs.edu
- Password: sao123

*Note: These are sample credentials. Implement proper authentication in production.*

## Production Deployment

### Environment Variables
Set these in your production environment:
```
PORT=5000
EMAIL_USER=sao@cccs.edu
EMAIL_PASS=your-secure-password
NODE_ENV=production
```

### Security Recommendations
1. Use HTTPS (SSL/TLS certificates)
2. Implement rate limiting
3. Add CORS restrictions
4. Use environment-specific configs
5. Enable logging and monitoring
6. Regular security updates

### Hosting Options
- **Heroku**: Easy deployment with free tier
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Scalable cloud hosting
- **Vercel/Netlify**: Frontend hosting (static files)
- **Railway**: Modern deployment platform

## Next Steps

1. ✅ Complete installation
2. ✅ Test email functionality
3. ⬜ Set up database (MySQL/PostgreSQL)
4. ⬜ Implement user authentication
5. ⬜ Add file upload functionality
6. ⬜ Deploy to production

## Support

For help or questions:
- Email: it@cccs.edu
- Phone: (032) XXX-XXXX
- Office: IT Department, Main Building

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
