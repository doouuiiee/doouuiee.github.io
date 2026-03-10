// ============================================
// SAO MANAGEMENT CENTER - Frontend Logic
// ============================================

let currentTab = 'attendance';
let attendanceData = [];
let appointmentsData = [];
let alertsData = [];
let currentFilter = 'all';

// Sample Data
const sampleAttendanceIssues = [
  {
    id: 1,
    lrn: '2024120001',
    name: 'Juan Dela Cruz',
    grade: 12,
    section: 'St. Margaret',
    issue: '5x late',
    count: 5,
    lastIncident: '2026-03-08',
    parentContact: '09123456789',
    status: 'critical'
  },
  {
    id: 2,
    lrn: '2024120045',
    name: 'Maria Santos',
    grade: 11,
    section: 'St. Gregory',
    issue: '3x absent',
    count: 3,
    lastIncident: '2026-03-07',
    parentContact: '09187654321',
    status: 'critical'
  },
  {
    id: 3,
    lrn: '2024120089',
    name: 'Pedro Garcia',
    grade: 10,
    section: 'St. Benedict',
    issue: '3x late',
    count: 3,
    lastIncident: '2026-03-06',
    parentContact: '09156789012',
    status: 'warning'
  }
];

const sampleAppointments = [
  {
    id: 1,
    lrn: '2024120001',
    studentName: 'Juan Dela Cruz',
    grade: 12,
    section: 'St. Margaret',
    type: 'Violation',
    matter: 'Academic Dishonesty',
    date: '2026-03-15',
    time: '10:00 AM',
    status: 'Pending',
    details: 'Cheating incident during exam',
    requestedDate: '2026-03-08'
  },
  {
    id: 2,
    lrn: '2024120045',
    studentName: 'Maria Santos',
    grade: 11,
    section: 'St. Gregory',
    type: 'Attendance Matters',
    matter: '3x absent',
    date: '2026-03-10',
    time: '2:00 PM',
    status: 'Confirmed',
    details: 'Discuss attendance issues',
    requestedDate: '2026-03-07'
  },
  {
    id: 3,
    lrn: '2024120089',
    studentName: 'Pedro Garcia',
    grade: 10,
    section: 'St. Benedict',
    type: 'Attendance Matters',
    matter: '5x late',
    date: '2026-03-09',
    time: '9:00 AM',
    status: 'Pending',
    details: 'Chronic tardiness discussion',
    requestedDate: '2026-03-06'
  }
];

const sampleAlerts = [
  {
    id: 1,
    type: '3x late',
    studentName: 'Pedro Garcia',
    lrn: '2024120089',
    sentTo: 'Parent (09156789012)',
    sentDate: '2026-03-06 08:30 AM',
    method: 'Email + SMS',
    status: 'Delivered'
  },
  {
    id: 2,
    type: '3x absent',
    studentName: 'Maria Santos',
    lrn: '2024120045',
    sentTo: 'Parent (09187654321)',
    sentDate: '2026-03-07 09:15 AM',
    method: 'Email + SMS',
    status: 'Delivered'
  },
  {
    id: 3,
    type: '5x late',
    studentName: 'Juan Dela Cruz',
    lrn: '2024120001',
    sentTo: 'Parent (09123456789)',
    sentDate: '2026-03-08 07:45 AM',
    method: 'Email + SMS',
    status: 'Delivered'
  }
];

// Initialize
function initManagementCenter() {
  // Set today's date
  document.getElementById('attendanceDate').valueAsDate = new Date();
  
  // Load data
  loadDashboardStats();
  loadAttendanceData();
  loadAppointments();
  loadRecentAlerts();
}

// Load Dashboard Stats
function loadDashboardStats() {
  // Critical alerts (students with 5x late or 3x absent)
  const critical = sampleAttendanceIssues.filter(i => i.status === 'critical').length;
  document.getElementById('criticalAlerts').textContent = critical;
  
  // Pending appointments
  const pending = sampleAppointments.filter(a => a.status === 'Pending').length;
  document.getElementById('pendingAppointments').textContent = pending;
  
  // Total attendance issues
  document.getElementById('attendanceIssues').textContent = sampleAttendanceIssues.length;
  
  // Today's absences (sample)
  document.getElementById('todayAbsences').textContent = '12';
}

// Switch Tabs
function switchTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.tab-button').classList.add('active');
  
  // Update content
  document.querySelectorAll('.content-tab').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tab + 'Tab').classList.add('active');
}

// Load Attendance Data
function loadAttendanceData() {
  // Update summary stats
  document.getElementById('totalStudents').textContent = '1,245';
  document.getElementById('presentCount').textContent = '1,180';
  document.getElementById('absentCount').textContent = '12';
  document.getElementById('lateCount').textContent = '48';
  document.getElementById('excusedCount').textContent = '5';
  
  // Load attendance issues
  const container = document.getElementById('attendanceIssuesList');
  container.innerHTML = sampleAttendanceIssues.map(issue => `
    <div class="bg-white/30 rounded-lg p-4 ${issue.status === 'critical' ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500'}">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              issue.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }">${issue.issue}</span>
            <span class="text-sm font-semibold text-lighter">${issue.name}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm text-light">
            <div>LRN: ${issue.lrn}</div>
            <div>Grade ${issue.grade} - ${issue.section}</div>
            <div>Count: ${issue.count} times</div>
            <div>Last: ${issue.lastIncident}</div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button onclick="contactParent('${issue.id}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm">
            <ion-icon name="call" class="align-middle"></ion-icon> Contact Parent
          </button>
          <button onclick="scheduleAppointment('${issue.lrn}')" class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-primary transition text-sm">
            <ion-icon name="calendar" class="align-middle"></ion-icon> Schedule Meeting
          </button>
          <button onclick="viewStudentRecord('${issue.lrn}')" class="bg-primary text-lighter px-4 py-2 rounded-lg hover:bg-secondary transition text-sm">
            <ion-icon name="document" class="align-middle"></ion-icon> View Record
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Load Appointments
function loadAppointments() {
  const container = document.getElementById('appointmentsList');
  const filtered = filterAppointmentsList();
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-light py-8">No appointments found</div>';
    return;
  }
  
  container.innerHTML = filtered.map(apt => `
    <div class="bg-white/30 rounded-xl p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              apt.type === 'Violation' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
            }">${apt.type}</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
              apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
            }">${apt.status}</span>
          </div>
          <h3 class="text-xl font-bold text-lighter mb-1">${apt.studentName}</h3>
          <p class="text-sm text-light mb-2">LRN: ${apt.lrn} | Grade ${apt.grade} - ${apt.section}</p>
          <p class="text-sm text-lighter mb-2"><strong>Matter:</strong> ${apt.matter}</p>
          <p class="text-sm text-light">${apt.details}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-light">Scheduled</p>
          <p class="font-bold text-lighter">${apt.date}</p>
          <p class="text-sm text-lighter">${apt.time}</p>
          <p class="text-xs text-light mt-2">Requested: ${apt.requestedDate}</p>
        </div>
      </div>
      <div class="flex gap-2">
        ${apt.status === 'Pending' ? `
          <button onclick="confirmAppointment(${apt.id})" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
            <ion-icon name="checkmark-circle" class="align-middle"></ion-icon> Confirm
          </button>
          <button onclick="rescheduleAppointment(${apt.id})" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            <ion-icon name="calendar" class="align-middle"></ion-icon> Reschedule
          </button>
          <button onclick="cancelAppointment(${apt.id})" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
            <ion-icon name="close-circle" class="align-middle"></ion-icon> Cancel
          </button>
        ` : apt.status === 'Confirmed' ? `
          <button onclick="markComplete(${apt.id})" class="flex-1 bg-primary text-lighter py-2 rounded-lg hover:bg-secondary transition">
            <ion-icon name="checkmark-done" class="align-middle"></ion-icon> Mark Complete
          </button>
          <button onclick="rescheduleAppointment(${apt.id})" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            <ion-icon name="calendar" class="align-middle"></ion-icon> Reschedule
          </button>
        ` : ''}
        <button onclick="viewAppointmentDetails(${apt.id})" class="bg-accent text-white px-6 py-2 rounded-lg hover:bg-primary transition">
          <ion-icon name="eye" class="align-middle"></ion-icon> View Details
        </button>
      </div>
    </div>
  `).join('');
}

// Filter Appointments
function filterAppointments(filter) {
  currentFilter = filter;
  
  // Update button styles
  document.querySelectorAll('.appointment-filter').forEach(btn => {
    btn.classList.remove('active', 'bg-primary/20', 'text-primary');
    btn.classList.add('bg-white/50', 'text-dark');
  });
  event.target.classList.remove('bg-white/50', 'text-dark');
  event.target.classList.add('active', 'bg-primary/20', 'text-primary');
  
  loadAppointments();
}

function filterAppointmentsList() {
  if (currentFilter === 'all') return sampleAppointments;
  if (currentFilter === 'pending') return sampleAppointments.filter(a => a.status === 'Pending');
  if (currentFilter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    return sampleAppointments.filter(a => a.date === today);
  }
  if (currentFilter === 'upcoming') {
    const today = new Date();
    return sampleAppointments.filter(a => new Date(a.date) > today);
  }
  if (currentFilter === 'violation') return sampleAppointments.filter(a => a.type === 'Violation');
  if (currentFilter === 'attendance') return sampleAppointments.filter(a => a.type === 'Attendance Matters');
  return sampleAppointments;
}

// Load Recent Alerts
function loadRecentAlerts() {
  const container = document.getElementById('recentAlertsList');
  container.innerHTML = sampleAlerts.map(alert => `
    <div class="bg-white/30 rounded-lg p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">${alert.type}</span>
        <span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">${alert.status}</span>
      </div>
      <p class="font-semibold text-lighter text-sm">${alert.studentName}</p>
      <p class="text-xs text-light">LRN: ${alert.lrn}</p>
      <p class="text-xs text-light mt-1">Sent to: ${alert.sentTo}</p>
      <p class="text-xs text-light">Via: ${alert.method}</p>
      <p class="text-xs text-light">Date: ${alert.sentDate}</p>
    </div>
  `).join('');
}

// Action Functions
function contactParent(issueId) {
  const issue = sampleAttendanceIssues.find(i => i.id == issueId);
  if (confirm(`Contact parent of ${issue.name}?\n\nPhone: ${issue.parentContact}\n\nThis will:\n- Send SMS notification\n- Send email alert\n- Log the contact attempt`)) {
    alert('Parent contacted successfully!\n\nSMS and email sent.\nContact logged in system.');
  }
}

function scheduleAppointment(lrn) {
  alert(`Opening appointment scheduler for LRN: ${lrn}\n\nThis will allow you to:\n- Select date and time\n- Choose appointment type\n- Add notes\n- Send confirmation to student and parent`);
}

function viewStudentRecord(lrn) {
  alert(`Opening complete student record for LRN: ${lrn}\n\nShowing:\n- Personal information\n- Attendance history\n- Violation records\n- Appointments\n- Academic performance`);
}

function confirmAppointment(id) {
  if (confirm('Confirm this appointment?')) {
    alert('Appointment confirmed!\n\nNotifications sent to:\n- Student\n- Parent\n- Class adviser');
    loadAppointments();
  }
}

function rescheduleAppointment(id) {
  alert('Opening reschedule dialog...\n\nSelect new date and time.');
}

function cancelAppointment(id) {
  if (confirm('Cancel this appointment?\n\nReason will be sent to student and parent.')) {
    alert('Appointment cancelled.\nNotifications sent.');
    loadAppointments();
  }
}

function markComplete(id) {
  if (confirm('Mark this appointment as completed?')) {
    alert('Appointment marked as complete.\n\nPlease add meeting notes and action items.');
  }
}

function viewAppointmentDetails(id) {
  const apt = sampleAppointments.find(a => a.id === id);
  alert(`Appointment Details:\n\nStudent: ${apt.studentName}\nLRN: ${apt.lrn}\nType: ${apt.type}\nMatter: ${apt.matter}\nDate: ${apt.date} at ${apt.time}\nStatus: ${apt.status}\n\nDetails: ${apt.details}`);
}

function sendBulkNotification() {
  const target = document.getElementById('bulkTarget').value;
  if (!target) {
    alert('Please select a target group');
    return;
  }
  if (confirm(`Send notification to ${target}?`)) {
    alert('Bulk notification sent successfully!');
  }
}

function generateReport(type) {
  alert(`Generating ${type} report...\n\nReport will be downloaded as PDF.`);
}

function searchStudent() {
  const query = document.getElementById('studentSearch').value;
  if (query.length < 2) {
    document.getElementById('studentSearchResults').innerHTML = '';
    return;
  }
  
  // Sample search results
  document.getElementById('studentSearchResults').innerHTML = `
    <div class="bg-white/30 rounded-lg p-3 cursor-pointer hover:bg-white/40" onclick="viewStudentRecord('2024120001')">
      <p class="font-semibold text-lighter">Juan Dela Cruz</p>
      <p class="text-xs text-light">LRN: 2024120001 | Grade 12 - St. Margaret</p>
    </div>
    <div class="bg-white/30 rounded-lg p-3 cursor-pointer hover:bg-white/40" onclick="viewStudentRecord('2024120045')">
      <p class="font-semibold text-lighter">Maria Santos</p>
      <p class="text-xs text-light">LRN: 2024120045 | Grade 11 - St. Gregory</p>
    </div>
  `;
}

function refreshData() {
  loadDashboardStats();
  loadAttendanceData();
  loadAppointments();
  loadRecentAlerts();
  alert('Data refreshed successfully!');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initManagementCenter);
