# 🔐 Section PINs Reference - Supervisory Committee

## Purpose
These PINs are used by the Supervisory Committee to access attendance sheets for each section. When opening the Attendance Sheet page and selecting a section, you will be prompted to enter the section's PIN.

---

## Grade 7 Sections

| Section | PIN | Room |
|---------|-----|------|
| St. Anthony | 0017 | Room 101 |
| St. Elizabeth | 0027 | Room 102 |
| St. Francis | 0037 | Room 103 |
| St. Joseph | 0047 | Room 104 |
| St. Michael | 0057 | Room 105 |
| St. Roque | 0067 | Room 106 |
| St. Thomas | 0077 | Room 107 |

---

## Grade 8 Sections

| Section | PIN | Room |
|---------|-----|------|
| St. Andrew | 0018 | Room 201 |
| St. Jude | 0028 | Room 202 |
| St. Lorenzo | 0038 | Room 203 |
| St. Martin | 0048 | Room 204 |
| St. Paul | 0058 | Room 205 |
| St. Peter | 0068 | Room 206 |

---

## Grade 9 Sections

| Section | PIN | Room |
|---------|-----|------|
| St. Agnes | 0019 | Room 301 |
| St. Anne | 0029 | Room 302 |
| St. Bernadette | 0039 | Room 303 |
| St. Bridget | 0049 | Room 304 |
| St. Monica | 0059 | Room 305 |
| St. Therese | 0069 | Room 306 |

---

## Grade 10 Sections

| Section | PIN | Room |
|---------|-----|------|
| St. Benedict | 0101 | Room 401 |
| St. John | 0102 | Room 402 |
| St. Luke | 0103 | Room 403 |
| St. Mark | 0104 | Room 404 |
| St. Matthew | 0105 | Room 405 |
| St. Phillip | 0106 | Room 406 |

---

## Grade 11 Sections

### STEM (Science Technology Engineering and Mathematics)
| Section | PIN | Room |
|---------|-----|------|
| St. Gregory | 0111 | Room 501 |
| St. Ignatius | 0112 | Room 502 |
| St. Pedro Calungsod | 0113 | Room 503 |

### HUMSS (Humanities and Social Sciences)
| Section | PIN | Room |
|---------|-----|------|
| St. James | 0114 | Room 504 |
| St. Timothy | 0115 | Room 505 |

### TVL (Technical-Vocational-Livelihood)
| Section | PIN | Room |
|---------|-----|------|
| St. Hannibal | 0116 | Room 506 |

### ABM (Accountancy and Business Management)
| Section | PIN | Room |
|---------|-----|------|
| St. Pio | 0117 | Room 507 |

---

## Grade 12 Sections

### STEM (Science Technology Engineering and Mathematics)
| Section | PIN | Room |
|---------|-----|------|
| St. Margaret | 0121 | Room 601 |
| St. Martha | 0122 | Room 602 |
| St. Rita of Casia | 0123 | Room 603 |

### HUMSS (Humanities and Social Sciences)
| Section | PIN | Room |
|---------|-----|------|
| St. Philomena | 0124 | Room 604 |
| St. Teresa de Avila | 0125 | Room 605 |

### TVL (Technical-Vocational-Livelihood)
| Section | PIN | Room |
|---------|-----|------|
| St. Agatha | 0126 | Room 606 |

### ABM (Accountancy and Business Management)
| Section | PIN | Room |
|---------|-----|------|
| St. Gertrude | 0127 | Room 607 |

---

## How to Use

### For Supervisory Committee Members:

1. **Access Attendance Sheet**
   - Go to the Attendance Sheet page
   - Select Grade Level
   - Select Section

2. **Enter PIN**
   - A modal will appear asking for the section PIN
   - Enter the 4-digit PIN for that section
   - Click "Access Attendance Sheet"

3. **View Masterlist**
   - Once authenticated, you can view the full student masterlist
   - See all students with their positions (officers and regular)
   - Mark attendance
   - Print or export the sheet

### Security Features:

- ✅ Each section has a unique PIN
- ✅ PIN required before viewing any attendance data
- ✅ Incorrect PIN shows error message
- ✅ Must re-enter PIN for each section
- ✅ Contact SAO Office if PIN is forgotten

---

## PIN Pattern

The PIN format follows this pattern:
- **First 2 digits**: Grade level (00 for Grade 7-10, 01 for Grade 11-12)
- **Last 2 digits**: Section number within grade

Examples:
- `0017` = Grade 7, Section 1 (St. Anthony)
- `0121` = Grade 12, Section 1 (St. Margaret)

---

## For SAO Office

### Changing PINs:
1. Edit the file: `public/js/sectionData.js`
2. Update the `pin` value for each section
3. Save and refresh the page
4. Distribute new PINs to Supervisory Committee members

### Adding New Sections:
1. Edit `public/js/sectionData.js`
2. Add new section object with name, pin, adviser, and room
3. Follow the existing format
4. Save and test

---

## Quick Reference Card

Print this for Supervisory Committee members:

```
SUPERVISORY COMMITTEE - SECTION PINS
====================================

Grade 7:  0017, 0027, 0037, 0047, 0057, 0067, 0077
Grade 8:  0018, 0028, 0038, 0048, 0058, 0068
Grade 9:  0019, 0029, 0039, 0049, 0059, 0069
Grade 10: 0101, 0102, 0103, 0104, 0105, 0106
Grade 11: 0111-0117 (by strand)
Grade 12: 0121-0127 (by strand)

Contact SAO Office for specific section PINs
```

---

## Total Sections: 43

- Grade 7: 7 sections
- Grade 8: 6 sections
- Grade 9: 6 sections
- Grade 10: 6 sections
- Grade 11: 7 sections (across 4 strands)
- Grade 12: 7 sections (across 4 strands)

**Total: 39 sections**
