// ============================================
// STUDENT DASHBOARD - Frontend Logic
// ============================================

const API_URL = 'http://localhost:5000/api';
let currentStudent = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let appointments = [];
let documents = [];
let classes = [];
let attendanceRecords = [];

// Sample Data (Replace with API calls)
const sampleStudent = {
  lrn: '2024120001',
  fullName: 'Juan Dela Cruz',
  gradeLevel: 'Grade 12',
  section: 'St. Margaret',
  strand: 'STEM',
  gender: 'Male',
  email: 'juan.delacruz@student.cccs.edu',
  profilePic: 'https://via.placeholder.com/150',
  parentGuardian: {
    fullName: 'Maria Dela Cruz',
    relationship: 'Mother',
    contactNumber: '09123456789',
    email: 'maria.delacruz@email.com',
    homeAddress: 'Cordova, Cebu'
  }
};

const sampleClasses = [
  { id: 1, name: 'General Mathematics', teacher: 'Ms. Santos', schedule: 'MWF 8:00-9:00 AM', present: 35, absent: 2, late: 3 },
  { id: 2, name: 'Physical Science', teacher: 'Mr. Garcia', schedule: 'TTH 9:00-10:30 AM', present: 32, absent: 1, late: 2 },
  { id: 3, name: 'English for Academic Purposes', teacher: 'Ms. Reyes', schedule: 'MWF 10:00-11:00 AM', present: 38, absent: 0, late: 1 },
  { id: 4, name: 'Statistics and Probability', teacher: 'Mr. Cruz', schedule: 'TTH 1:00-2:30 PM', present: 33, absent: 3, late: 4 },
  { id: 5, name: 'Physical Education', teacher: 'Coach Lopez', schedule: 'F 2:00-4:00 PM', present: 36, absent: 2, late: 2 },
  { id: 6, name: 'Research', teacher: 'Dr. Fernandez', schedule: 'W 1:00-3:00 PM', present: 34, absent: 1, late: 1 },
  { id: 7, name: 'Empowerment Technologies', teacher: 'Mr. Tan', schedule: 'M 2:00-4:00 PM', present: 37, absent: 1, late: 0 },
  { id: 8, name: 'Practical Research 2', teacher: 'Ms. Villanueva', schedule: 'TH 3:00-5:00 PM', present: 35, absent: 2, late: 2 }
];

const sampleDocuments = [
  { id: 1, name: 'Excuse Slip - Sick', type: 'sick', date: '2026-03-05', status: 'Approved', image: 'excuse1.jpg' },
  { id: 2, name: 'Excuse Slip - Medical Appointment', type: 'medical', date: '2026-03-01', status: 'Approved', image: 'excuse2.jpg' },
  { id: 3, name: 'Excuse Slip - Family Emergency', type: 'emergency', date: '2026-02-28', status: 'Pending', image: 'excuse3.jpg' },
  { id: 4, name: 'Excuse Slip - Sick', type: 'sick', date: '2026-02-25', status: 'Approved', image: 'excuse4.jpg' },
  { id: 5, name: 'Excuse Slip - Personal Matter', type: 'personal', date: '2026-02-20', status: 'Rejected', image: 'excuse5.jpg' }
];

const sampleAppointments = [
  { id: 1, date: '2026-03-15', time: '10:00 AM', purpose: 'Guidance Counseling', status: 'Confirmed', notes: 'Career guidance session' },
  { id: 2, date: '2026-03-20', time: '2:00 PM', purpose: 'Document Request', status: 'Pending', notes: 'Pick up certificate' },
  { id: 3, date: '2026-03-25', time: '9:00 AM', purpose: 'Consultation', status: 'Confirmed', notes: 'Discuss research topic' }
];

const sampleAttendance = [
  { date: '2026-03-08', status: 'Present', timeIn: '7:45 AM', remarks: 'On time' },
  { date: '2026-03-07', status: 'Present', timeIn: '7:50 AM', remarks: 'On time' },
  { date: '2026-03-06', status: 'Late', timeIn: '8:15 AM', remarks: 'Traffic' },
  { date: '2026-03-05', status: 'Present', timeIn: '7:40 AM', remarks: 'On time' },
  { date: '2026-03-04', status: 'Present', timeIn: '7:55 AM', remarks: 'On time' },
  { date: '2026-03-03', status: 'Absent', timeIn: '-', remarks: 'Sick (Excused)' },
  { date: '2026-03-01', status: 'Present', timeIn: '7:48 AM', remarks: 'On time' }
];

// Violation Types with Descriptions (from constants.js)
const violationTypes = VIOLATION_TYPES;

// Sample Notifications
const sampleNotifications = [
  { id: 1, type: 'appointments', title: 'Appointment Confirmed', message: 'Your appointment on March 15, 2026 at 10:00 AM has been confirmed.', date: '2026-03-10', read: false },
  { id: 2, type: 'violations', title: 'Violation Notice', message: 'You have been issued a violation for late attendance. Please see the SAO office.', date: '2026-03-09', read: false },
  { id: 3, type: 'attendance', title: 'Attendance Alert', message: 'You have been late 3 times this month. Please improve your punctuality.', date: '2026-03-08', read: true },
  { id: 4, type: 'appointments', title: 'Appointment Reminder', message: 'Reminder: You have an appointment tomorrow at 2:00 PM.', date: '2026-03-07', read: true },
  { id: 5, type: 'attendance', title: 'Perfect Attendance', message: 'Congratulations! You had perfect attendance last week.', date: '2026-03-05', read: true },
  { id: 6, type: 'violations', title: 'Violation Cleared', message: 'Your previous violation has been cleared after completing the required actions.', date: '2026-03-03', read: true }
];

// Sample My Appointments (with LRN)
const sampleMyAppointments = [
  { id: 1, lrn: '2024120001', date: '2026-03-15', time: '10:00 AM', type: 'Violation', matter: 'Academic Dishonesty', status: 'Confirmed', details: 'Discussion about recent incident' },
  { id: 2, lrn: '2024120001', date: '2026-03-20', time: '2:00 PM', type: 'Attendance Matters', matter: '3x late', status: 'Pending', details: 'Review attendance record' },
  { id: 3, lrn: '2024120001', date: '2026-03-25', time: '9:00 AM', type: 'Violation', matter: 'Behavioral Misconduct', status: 'Confirmed', details: 'Follow-up meeting' },
  { id: 4, lrn: '2024120001', date: '2026-03-01', time: '11:00 AM', type: 'Attendance Matters', matter: '5x late', status: 'Completed', details: 'Discussed punctuality issues' },
  { id: 5, lrn: '2024120001', date: '2026-02-28', time: '3:00 PM', type: 'Violation', matter: 'Policy Violations', status: 'Completed', details: 'Uniform violation discussion' }
];

let notifications = [];
let myAppointments = [];
let currentNotificationFilter = 'all';
let currentAppointmentFilter = 'upcoming';
let selectedSAOAppointmentType = '';
let selectedSAOAppointmentMatter = '';

// Initialize Dashboard
function initDashboard() {
  currentStudent = sampleStudent;
  classes = sampleClasses;
  documents = sampleDocuments;
  appointments = sampleAppointments;
  attendanceRecords = sampleAttendance;
  notifications = sampleNotifications;
  myAppointments = sampleMyAppointments;
  
  loadStudentProfile();
  loadDashboardStats();
  loadDocuments();
  loadClasses();
  loadCalendar();
  loadRecentAttendance();
  loadUpcomingAppointments();
  loadNotifications();
  loadMyAppointments();
  populateViolationTypes();
  initializeCharts();
}

// Initialize Charts
function initializeCharts() {
  // Attendance Trend Chart (Line Chart)
  const attendanceCtx = document.getElementById('attendanceChart');
  if (attendanceCtx) {
    new Chart(attendanceCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Present',
          data: [95, 92, 88, 89],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Late',
          data: [3, 5, 8, 7],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Absent',
          data: [2, 3, 4, 4],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#e5d7c4' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#e5d7c4' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#e5d7c4' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  // Attendance Distribution (Pie Chart)
  const pieCtx = document.getElementById('attendancePieChart');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Late', 'Absent', 'Excused'],
        datasets: [{
          data: [107, 8, 5, 3],
          backgroundColor: [
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#3b82f6'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e5d7c4', padding: 15 }
          }
        }
      }
    });
  }
}

// Load Student Profile
function loadStudentProfile() {
  document.getElementById('sidebarStudentName').textContent = currentStudent.fullName.split(' ')[0];
  document.getElementById('sidebarProfilePic').src = currentStudent.profilePic;
  document.getElementById('studentGreeting').textContent = currentStudent.fullName.split(' ')[0];
  document.getElementById('profilePic').src = currentStudent.profilePic;
  document.getElementById('profileName').textContent = currentStudent.fullName;
  document.getElementById('profileLRN').textContent = currentStudent.lrn;
  document.getElementById('profileGrade').textContent = currentStudent.gradeLevel;
  document.getElementById('profileSection').textContent = currentStudent.section;
  document.getElementById('profileStrand').textContent = currentStudent.strand || 'N/A';
  document.getElementById('profileGender').textContent = currentStudent.gender;
  document.getElementById('profileEmail').textContent = currentStudent.email;
  
  // Parent info
  document.getElementById('parentName').textContent = currentStudent.parentGuardian.fullName;
  document.getElementById('parentRelation').textContent = currentStudent.parentGuardian.relationship;
  document.getElementById('parentContact').textContent = currentStudent.parentGuardian.contactNumber;
  document.getElementById('parentEmail').textContent = currentStudent.parentGuardian.email;
  document.getElementById('parentAddress').textContent = currentStudent.parentGuardian.homeAddress;
  
  // Attendance summary
  const present = attendanceRecords.filter(r => r.status === 'Present').length;
  const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
  const late = attendanceRecords.filter(r => r.status === 'Late').length;
  const excused = attendanceRecords.filter(r => r.remarks.includes('Excused')).length;
  
  document.getElementById('totalDays').textContent = attendanceRecords.length;
  document.getElementById('presentDays').textContent = present;
  document.getElementById('absentDays').textContent = absent;
  document.getElementById('lateDays').textContent = late;
  document.getElementById('excusedDays').textContent = excused;
}

// Load Dashboard Stats
function loadDashboardStats() {
  const present = attendanceRecords.filter(r => r.status === 'Present').length;
  const rate = Math.round((present / attendanceRecords.length) * 100);
  
  document.getElementById('attendanceRate').textContent = rate + '%';
  document.getElementById('totalClasses').textContent = classes.length;
  document.getElementById('upcomingAppointments').textContent = appointments.filter(a => a.status !== 'Completed').length;
  document.getElementById('totalDocuments').textContent = documents.length;
}

// Load Recent Attendance
function loadRecentAttendance() {
  const container = document.getElementById('recentAttendance');
  container.innerHTML = attendanceRecords.slice(0, 5).map(record => `
    <div class="bg-white/50 rounded-lg p-3">
      <div class="flex justify-between items-center">
        <div>
          <p class="font-semibold text-lighter">${record.date}</p>
          <p class="text-xs text-light">${record.timeIn} - ${record.remarks}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${
          record.status === 'Present' ? 'bg-green-100 text-green-700' :
          record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }">${record.status}</span>
      </div>
    </div>
  `).join('');
}

// Load Upcoming Appointments
function loadUpcomingAppointments() {
  const container = document.getElementById('upcomingAppointmentsList');
  const upcoming = appointments.filter(a => a.status !== 'Completed').slice(0, 5);
  
  if (upcoming.length === 0) {
    container.innerHTML = '<p class="text-sm text-light">No upcoming appointments</p>';
    return;
  }
  
  container.innerHTML = upcoming.map(apt => `
    <div class="bg-white/50 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <p class="font-semibold text-lighter">${apt.purpose}</p>
        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }">${apt.status}</span>
      </div>
      <p class="text-xs text-light">${apt.date} at ${apt.time}</p>
      <p class="text-xs text-light mt-1">${apt.notes}</p>
    </div>
  `).join('');
}

// Load Documents
function loadDocuments() {
  const container = document.getElementById('documentsList');
  const filtered = filterDocumentsList();
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No excuse slips found</div>';
    return;
  }
  
  container.innerHTML = filtered.map(doc => `
    <div class="glass rounded-xl p-4 hover:shadow-lg transition">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <ion-icon name="document-attach" class="text-2xl text-accent"></ion-icon>
          </div>
          <div>
            <p class="font-semibold text-lighter">${doc.name}</p>
            <p class="text-xs text-light">Submitted: ${doc.date}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${
            doc.status === 'Approved' ? 'bg-green-100 text-green-700' :
            doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }">${doc.status}</span>
          <button onclick="viewExcuseSlip(${doc.id})" class="text-accent hover:text-secondary">
            <ion-icon name="eye" class="text-xl"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter Documents
function filterDocumentsList() {
  const search = document.getElementById('docSearch')?.value.toLowerCase() || '';
  const filter = document.getElementById('docFilter')?.value || 'all';
  
  return documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search);
    const matchesFilter = filter === 'all' || doc.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });
}

function filterDocuments() {
  loadDocuments();
}

// Upload Excuse Slip
function uploadExcuseSlip() {
  document.getElementById('documentModal').classList.add('active');
}

function closeDocumentModal() {
  document.getElementById('documentModal').classList.remove('active');
}

function previewExcuseSlip(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('imagePreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

function submitExcuseSlip(event) {
  event.preventDefault();
  
  const newDocument = {
    id: documents.length + 1,
    name: 'Excuse Slip - ' + document.getElementById('excuseReason').value,
    type: document.getElementById('excuseReason').value.toLowerCase(),
    date: document.getElementById('excuseDate').value,
    status: 'Pending',
    image: 'uploaded_' + Date.now() + '.jpg'
  };
  
  documents.push(newDocument);
  closeDocumentModal();
  loadDocuments();
  loadDashboardStats();
  
  alert('Excuse slip submitted successfully! You will be notified once it is reviewed.');
  event.target.reset();
  document.getElementById('imagePreview').classList.add('hidden');
}

function viewExcuseSlip(id) {
  const doc = documents.find(d => d.id === id);
  alert(`Excuse Slip Details:\n\nName: ${doc.name}\nDate: ${doc.date}\nStatus: ${doc.status}\n\nImage: ${doc.image}\n\nThis will open the image viewer in the full application.`);
}

// Load Classes
function loadClasses() {
  const container = document.getElementById('classesList');
  container.innerHTML = classes.map(cls => `
    <div class="glass rounded-xl p-6 hover:shadow-lg transition">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-lighter">${cls.name}</h3>
          <p class="text-sm text-light">${cls.teacher}</p>
          <p class="text-xs text-light mt-1">${cls.schedule}</p>
        </div>
        <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <ion-icon name="book" class="text-2xl text-accent"></ion-icon>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center text-sm">
        <div class="bg-green-100 rounded-lg p-2">
          <p class="font-bold text-green-700">${cls.present}</p>
          <p class="text-xs text-green-600">Present</p>
        </div>
        <div class="bg-red-100 rounded-lg p-2">
          <p class="font-bold text-red-700">${cls.absent}</p>
          <p class="text-xs text-red-600">Absent</p>
        </div>
        <div class="bg-yellow-100 rounded-lg p-2">
          <p class="font-bold text-yellow-700">${cls.late}</p>
          <p class="text-xs text-yellow-600">Late</p>
        </div>
      </div>
      <button onclick="viewClassDetails(${cls.id})" class="w-full mt-4 bg-primary text-lighter py-2 rounded-lg hover:bg-secondary transition text-sm">
        View Details
      </button>
    </div>
  `).join('');
}

// Load Calendar
function loadCalendar() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calendarMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  
  const container = document.getElementById('calendarDays');
  let html = '';
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    html += '<div></div>';
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasAppointment = appointments.some(a => a.date === date);
    const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${hasAppointment ? 'has-appointment' : ''} 
                  bg-white/50 rounded-lg p-2 text-center cursor-pointer"
           onclick="selectDate('${date}')">
        <p class="text-sm font-semibold text-primary">${day}</p>
        ${hasAppointment ? '<div class="w-2 h-2 bg-accent rounded-full mx-auto mt-1"></div>' : ''}
      </div>
    `;
  }
  
  container.innerHTML = html;
  loadAppointmentsList();
}

function previousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  loadCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  loadCalendar();
}

function selectDate(date) {
  const dayAppointments = appointments.filter(a => a.date === date);
  if (dayAppointments.length > 0) {
    alert(`Appointments on ${date}:\n\n` + dayAppointments.map(a => `${a.time} - ${a.purpose} (${a.status})`).join('\n'));
  }
}

// Load Appointments List
function loadAppointmentsList() {
  const container = document.getElementById('appointmentsList');
  const monthAppointments = appointments.filter(a => {
    const aptDate = new Date(a.date);
    return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
  });
  
  if (monthAppointments.length === 0) {
    container.innerHTML = '<p class="text-sm text-light">No appointments this month</p>';
    return;
  }
  
  container.innerHTML = monthAppointments.map(apt => `
    <div class="bg-white/50 rounded-lg p-3">
      <div class="flex justify-between items-start mb-1">
        <p class="font-semibold text-lighter text-sm">${apt.purpose}</p>
        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }">${apt.status}</span>
      </div>
      <p class="text-xs text-light">${apt.date}</p>
      <p class="text-xs text-light">${apt.time}</p>
    </div>
  `).join('');
}

// Section Navigation
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  
  // Show selected section
  document.getElementById(section + 'Section').classList.add('active');
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
}

// Search Content
function searchContent(query) {
  if (!query || query.length < 2) {
    document.getElementById('searchResults').classList.add('hidden');
    return;
  }
  
  const results = [];
  query = query.toLowerCase();
  
  // Search in classes/subjects
  classes.forEach(cls => {
    if (cls.name.toLowerCase().includes(query) || 
        cls.teacher.toLowerCase().includes(query) ||
        cls.schedule.toLowerCase().includes(query)) {
      results.push({
        type: 'class',
        title: cls.name,
        subtitle: `${cls.teacher} - ${cls.schedule}`,
        icon: 'book',
        action: () => viewClassDetails(cls.id)
      });
    }
  });
  
  // Search in attendance records by date
  attendanceRecords.forEach(record => {
    if (record.date.includes(query) || 
        record.status.toLowerCase().includes(query)) {
      results.push({
        type: 'attendance',
        title: `Attendance: ${record.status}`,
        subtitle: `${record.date} - ${record.timeIn}`,
        icon: 'calendar',
        action: () => alert(`Attendance on ${record.date}: ${record.status}\nTime In: ${record.timeIn}\nRemarks: ${record.remarks}`)
      });
    }
  });
  
  // Search in appointments
  appointments.forEach(apt => {
    if (apt.date.includes(query) || 
        apt.purpose.toLowerCase().includes(query) ||
        apt.time.toLowerCase().includes(query)) {
      results.push({
        type: 'appointment',
        title: apt.purpose,
        subtitle: `${apt.date} at ${apt.time}`,
        icon: 'time',
        action: () => alert(`Appointment: ${apt.purpose}\nDate: ${apt.date}\nTime: ${apt.time}\nStatus: ${apt.status}`)
      });
    }
  });
  
  // Search in documents
  documents.forEach(doc => {
    if (doc.name.toLowerCase().includes(query) || 
        doc.date.includes(query) ||
        doc.status.toLowerCase().includes(query)) {
      results.push({
        type: 'document',
        title: doc.name,
        subtitle: `${doc.date} - ${doc.status}`,
        icon: 'document-text',
        action: () => viewExcuseSlip(doc.id)
      });
    }
  });
  
  // Display results
  const resultsContainer = document.getElementById('searchResults');
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="p-4 text-sm text-gray-500">No results found</div>';
  } else {
    resultsContainer.innerHTML = results.slice(0, 10).map(result => `
      <div class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200" onclick='${result.action.toString().replace(/'/g, "\\'")}'>
        <div class="flex items-center gap-3">
          <ion-icon name="${result.icon}" class="text-xl text-accent"></ion-icon>
          <div class="flex-1">
            <p class="font-semibold text-sm text-primary">${result.title}</p>
            <p class="text-xs text-gray-600">${result.subtitle}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  resultsContainer.classList.remove('hidden');
}

// Close search results when clicking outside
document.addEventListener('click', function(event) {
  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  if (searchInput && searchResults && 
      !searchInput.contains(event.target) && 
      !searchResults.contains(event.target)) {
    searchResults.classList.add('hidden');
  }
});

// Upload Photo
function uploadPhoto() {
  alert('Photo upload functionality - Connect to backend API');
}

// Book Appointment
function bookAppointment() {
  document.getElementById('appointmentModal').classList.add('active');
}

function closeAppointmentModal() {
  document.getElementById('appointmentModal').classList.remove('active');
}

function submitAppointment(event) {
  event.preventDefault();
  
  const newAppointment = {
    id: appointments.length + 1,
    date: document.getElementById('appointmentDate').value,
    time: document.getElementById('appointmentTime').value,
    purpose: document.getElementById('appointmentPurpose').value,
    notes: document.getElementById('appointmentNotes').value,
    status: 'Pending'
  };
  
  appointments.push(newAppointment);
  closeAppointmentModal();
  loadCalendar();
  loadUpcomingAppointments();
  loadDashboardStats();
  
  alert('Appointment request submitted! You will receive a confirmation email.');
  event.target.reset();
}

// View Class Details
function viewClassDetails(id) {
  const cls = classes.find(c => c.id === id);
  alert(`Class: ${cls.name}\nTeacher: ${cls.teacher}\nSchedule: ${cls.schedule}\n\nAttendance:\nPresent: ${cls.present}\nAbsent: ${cls.absent}\nLate: ${cls.late}`);
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// ============================================
// NOTIFICATIONS FUNCTIONS
// ============================================

function loadNotifications() {
  const container = document.getElementById('notificationsList');
  const filtered = filterNotificationsList();
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No notifications found</div>';
    return;
  }
  
  container.innerHTML = filtered.map(notif => `
    <div class="glass rounded-xl p-4 hover:shadow-lg transition ${notif.read ? 'opacity-75' : ''}">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-4 flex-1">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center ${
            notif.type === 'violations' ? 'bg-red-100' :
            notif.type === 'appointments' ? 'bg-blue-100' :
            'bg-yellow-100'
          }">
            <ion-icon name="${
              notif.type === 'violations' ? 'warning' :
              notif.type === 'appointments' ? 'calendar' :
              'time'
            }" class="text-2xl ${
              notif.type === 'violations' ? 'text-red-500' :
              notif.type === 'appointments' ? 'text-blue-500' :
              'text-yellow-600'
            }"></ion-icon>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-bold text-lighter">${notif.title}</h3>
              ${!notif.read ? '<span class="w-2 h-2 bg-accent rounded-full"></span>' : ''}
            </div>
            <p class="text-sm text-light mb-2">${notif.message}</p>
            <p class="text-xs text-light">${notif.date}</p>
          </div>
        </div>
        <button onclick="markAsRead(${notif.id})" class="text-accent hover:text-primary">
          <ion-icon name="${notif.read ? 'checkmark-done' : 'checkmark'}" class="text-xl"></ion-icon>
        </button>
      </div>
    </div>
  `).join('');
}

function filterNotificationsList() {
  if (currentNotificationFilter === 'all') {
    return notifications;
  } else if (currentNotificationFilter === 'unread') {
    return notifications.filter(n => !n.read);
  } else {
    return notifications.filter(n => n.type === currentNotificationFilter);
  }
}

function filterNotifications(type) {
  currentNotificationFilter = type;
  
  // Update button styles
  document.querySelectorAll('.notification-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-primary/20', 'text-primary');
    btn.classList.add('bg-white/50', 'text-dark');
  });
  
  event.target.classList.remove('bg-white/50', 'text-dark');
  event.target.classList.add('active', 'bg-primary/20', 'text-primary');
  
  loadNotifications();
}

function markAsRead(id) {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    loadNotifications();
  }
}

// ============================================
// MY APPOINTMENTS FUNCTIONS
// ============================================

function loadMyAppointments() {
  const container = document.getElementById('myAppointmentsList');
  const filtered = filterMyAppointmentsList();
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No appointments found</div>';
    return;
  }
  
  container.innerHTML = filtered.map(apt => `
    <div class="glass rounded-xl p-6 hover:shadow-lg transition">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              apt.type === 'Violation' ? 'bg-red-100 text-red-700' : 'bg-accent/20 text-primary'
            }">${apt.type}</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
              apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }">${apt.status}</span>
          </div>
          <h3 class="text-xl font-bold text-lighter mb-1">${apt.matter}</h3>
          <p class="text-sm text-light mb-2">LRN: ${apt.lrn}</p>
        </div>
        <div class="w-12 h-12 rounded-lg flex items-center justify-center ${
          apt.type === 'Violation' ? 'bg-red-100' : 'bg-accent/20'
        }">
          <ion-icon name="${apt.type === 'Violation' ? 'warning' : 'calendar'}" class="text-2xl ${
            apt.type === 'Violation' ? 'text-red-500' : 'text-accent'
          }"></ion-icon>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <p class="text-light">Date</p>
          <p class="font-semibold text-lighter">${apt.date}</p>
        </div>
        <div>
          <p class="text-light">Time</p>
          <p class="font-semibold text-lighter">${apt.time}</p>
        </div>
      </div>
      <div class="bg-white/30 rounded-lg p-3">
        <p class="text-xs text-light mb-1">Details:</p>
        <p class="text-sm text-lighter">${apt.details}</p>
      </div>
    </div>
  `).join('');
}

function filterMyAppointmentsList() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (currentAppointmentFilter === 'upcoming') {
    return myAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && apt.status !== 'Completed';
    });
  } else {
    return myAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate < today || apt.status === 'Completed';
    });
  }
}

function filterAppointments(type) {
  currentAppointmentFilter = type;
  
  // Update button styles
  document.querySelectorAll('.appointment-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-primary/20', 'text-primary');
    btn.classList.add('bg-white/50', 'text-dark');
  });
  
  event.target.classList.remove('bg-white/50', 'text-dark');
  event.target.classList.add('active', 'bg-primary/20', 'text-primary');
  
  loadMyAppointments();
}

// ============================================
// SAO APPOINTMENT BOOKING FUNCTIONS
// ============================================

function bookNewAppointment() {
  document.getElementById('saoAppointmentModal').classList.add('active');
}

function closeSAOAppointmentModal() {
  document.getElementById('saoAppointmentModal').classList.remove('active');
  document.getElementById('violationTypeModal').classList.remove('active');
  document.getElementById('attendanceMatterModal').classList.remove('active');
  document.getElementById('scheduleAppointmentModal').classList.remove('active');
  selectedSAOAppointmentType = '';
  selectedSAOAppointmentMatter = '';
}

function selectAppointmentType(type) {
  selectedSAOAppointmentType = type;
  document.getElementById('saoAppointmentModal').classList.remove('active');
  
  if (type === 'violation') {
    document.getElementById('violationTypeModal').classList.add('active');
  } else if (type === 'attendance') {
    document.getElementById('attendanceMatterModal').classList.add('active');
  }
}

function backToSAOAppointment() {
  document.getElementById('violationTypeModal').classList.remove('active');
  document.getElementById('attendanceMatterModal').classList.remove('active');
  document.getElementById('saoAppointmentModal').classList.add('active');
  selectedSAOAppointmentType = '';
}

function populateViolationTypes() {
  const container = document.getElementById('violationTypesList');
  container.innerHTML = violationTypes.map(violation => `
    <button onclick="selectViolationType('${violation.name}')" class="w-full bg-white/50 text-dark py-4 px-4 rounded-lg hover:bg-red-100 transition text-left">
      <p class="font-semibold text-primary">${violation.name}</p>
      <p class="text-xs text-light mt-1">${violation.description}</p>
    </button>
  `).join('');
}

function selectViolationType(type) {
  selectedSAOAppointmentMatter = type;
  continueToSchedule();
}

function selectAttendanceMatter(matter) {
  selectedSAOAppointmentMatter = matter;
  continueToSchedule();
}

function continueToSchedule() {
  document.getElementById('violationTypeModal').classList.remove('active');
  document.getElementById('attendanceMatterModal').classList.remove('active');
  document.getElementById('scheduleAppointmentModal').classList.add('active');
  
  // Update the display
  document.getElementById('selectedAppointmentType').textContent = 
    selectedSAOAppointmentType === 'violation' ? 'Violation' : 'Attendance Matters';
  document.getElementById('selectedAppointmentMatter').textContent = selectedSAOAppointmentMatter;
}

function backToViolationType() {
  document.getElementById('scheduleAppointmentModal').classList.remove('active');
  
  if (selectedSAOAppointmentType === 'violation') {
    document.getElementById('violationTypeModal').classList.add('active');
  } else {
    document.getElementById('attendanceMatterModal').classList.add('active');
  }
}

function confirmScheduledAppointment(event) {
  event.preventDefault();
  
  const newAppointment = {
    id: myAppointments.length + 1,
    lrn: currentStudent.lrn,
    date: document.getElementById('scheduleDate').value,
    time: document.getElementById('scheduleTime').value,
    type: selectedSAOAppointmentType === 'violation' ? 'Violation' : 'Attendance Matters',
    matter: selectedSAOAppointmentMatter,
    status: 'Pending',
    details: document.getElementById('scheduleDetails').value || 'No additional details'
  };
  
  myAppointments.push(newAppointment);
  
  // Add notification
  const newNotification = {
    id: notifications.length + 1,
    type: 'appointments',
    title: 'Appointment Requested',
    message: `Your appointment for ${selectedSAOAppointmentMatter} on ${newAppointment.date} has been submitted and is pending approval.`,
    date: new Date().toISOString().split('T')[0],
    read: false
  };
  notifications.unshift(newNotification);
  
  closeSAOAppointmentModal();
  loadMyAppointments();
  loadNotifications();
  
  alert('Appointment request submitted successfully! You will receive a notification once it is confirmed.');
  event.target.reset();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
