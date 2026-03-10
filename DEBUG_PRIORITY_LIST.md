# 🐛 Debug Priority List

## ✅ CRITICAL ISSUES (Must Fix Before Testing)

### 1. **MongoDB Model Conversion** - HIGH PRIORITY ⚠️
**Problem:** 4 models still use MySQL syntax instead of MongoDB/Mongoose

**Affected Files:**
- `models/Teacher.js` - Uses MySQL `query()` function
- `models/Parent.js` - Uses MySQL `query()` function  
- `models/Section.js` - Uses MySQL `query()` function
- `models/Notification.js` - Uses MySQL `query()` function

**Already Converted (Working):**
- ✅ `models/User.js` - MongoDB/Mongoose
- ✅ `models/Student.js` - MongoDB/Mongoose
- ✅ `models/Attendance.js` - MongoDB/Mongoose

**Impact:** 
- Registration will fail when trying to create Teacher/Parent records
- Teacher dashboard won't load
- Notifications won't work
- Section management won't work

**Solution:** Convert these 4 models to use Mongoose schemas like User, Student, and Attendance models

---

## ⚠️ MEDIUM PRIORITY ISSUES (Cosmetic/Non-Critical)

### 2. **Missing PWA Icons** - LOW PRIORITY
**Problem:** 404 errors for icon files

**Missing Files:**
- `/icon-192.png` (404)
- `/icon-512.png` (404)
- `/favicon.ico` (404)

**Impact:** 
- PWA installation won't show proper icons
- Browser tab shows default icon
- Does NOT affect functionality

**Solution:** See `CREATE_ICONS_GUIDE.md` for options (can skip for defense)

---

### 3. **Email Service Reference** - MEDIUM PRIORITY
**Problem:** `routes/auth.js` references `emailService` that doesn't exist

**Line:** 
```javascript
const emailService = require('../services/emailService');
```

**Impact:**
- Registration emails won't send
- System will still work, just no email notifications

**Solution:** 
- Either create `services/emailService.js`
- Or use the email routes in `server.js` directly
- Or disable email for demo (not critical)

---

## 📊 PRIORITY RECOMMENDATION

### Do This NOW (Before Testing):
1. ✅ **Convert 4 models to MongoDB** - This is blocking core functionality

### Do This Later (Optional):
2. ⏭️ **Fix email service** - Nice to have, not critical for demo
3. ⏭️ **Add PWA icons** - Cosmetic only

---

## 🎯 RECOMMENDED ACTION

**Option A: Full Fix (1-2 hours)**
- Convert all 4 models to MongoDB
- Fix email service
- Add icons
- Test everything

**Option B: Quick Fix (30 minutes)** ⭐ RECOMMENDED
- Convert only Teacher and Parent models (needed for registration)
- Skip Section and Notification for now
- Skip icons (not needed for demo)
- Test basic functionality

**Option C: Minimal Fix (15 minutes)**
- Disable teacher registration temporarily
- Only test student features
- Skip everything else
- Quick demo prep

---

## 🚀 WHAT I RECOMMEND

Since you're preparing for defense, let's do **Option B: Quick Fix**

I'll convert Teacher and Parent models to MongoDB right now, which will allow:
- ✅ Student registration to work
- ✅ Teacher registration to work  
- ✅ Basic dashboard functionality
- ✅ Core features for demo

We can skip:
- ⏭️ Section model (can hardcode sections for demo)
- ⏭️ Notification model (can show UI without backend)
- ⏭️ Icons (cosmetic only)
- ⏭️ Email service (can mention "would send email" in demo)

**This gets you a working demo in 30 minutes.**

---

## 💬 YOUR DECISION

Tell me which option you prefer:
1. "Fix everything" - Full fix (1-2 hours)
2. "Quick fix" - Teacher + Parent models only (30 min) ⭐
3. "Minimal" - Skip models, test what works (15 min)
4. "Show me what works now" - Test current state first

I recommend Option 2 (Quick fix) to get you demo-ready fast.
