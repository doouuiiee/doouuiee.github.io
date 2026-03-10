// ============================================
// SAO DASHBOARD - Frontend Logic
// ============================================

const API_URL = 'http://localhost:5000/api';
let currentSAO = null;
let sections = [];
let notifications = [];
let documentRequests = [];

// Sample Data
const sampleSAO = {
  employeeId: 'SAO-2024-001',
  fullName: 'Patricia Gonzales',
  office: 'Student Affairs Office',
  email: 'patricia.gonzales@cccs.edu',
  profilePic: 'https://via.placeholder.com/80'
};

const sampleSections = [
  { grade: 7, name: 'St. Anthony', students: 35, adviser: 'Ms. Cruz', strand: null },
  { grade: 7, name: 'St. Elizabeth', students: 33, adviser: 'Mr. Reyes', strand: null },
  { grade: 8, name: 'St. Andrew', students: 32, adviser: 'Ms. Lopez', strand: null },
  { grade: 8, name: 'St. Jude', students: 34, adviser: 'Mr. Garcia', strand: null },
  { grade: 9, name: 'St. Agnes', students: 36, adviser: 'Ms. Santos', strand: null },
  { grade: 9, name: 'St. Anne', students: 35, adviser: 'Mr. Torres', strand: null },
  { grade: 10, name: 'St. Benedict', students: 38, adviser: 'Ms. Fernandez', strand: null },
  { grade: 10, name: 'St. John', students: 37, adviser: 'Mr. Mendoza', strand: null },
  { grade: 11, name: 'St. Gregory', students: 40, adviser: 'Ms. Ramos', strand: 'STEM' },
  { grade: 11, name: 'St. James', students: 35, adviser: 'Mr. Villanueva', strand: 'HUMSS' },
  { grade: 12, name: 'St. Margaret', students: 42, adviser: 'Ms. Santos', strand: 'STEM' },
  { grade: 12, name: 'St. Philomena', students: 38, adviser: 'Mr. Cruz', strand: 'HUMSS' }
];

const sampleNotifications = [
  { id: 1, title: 'School Event Reminder', message: 'Foundation Day celebration on March 20, 2026', recipients: 'All Students', date: '2026-03-08', status: 'Sent' },
  { id: 2, title: 'Document Submission Deadline', message: 'Submit all requirements by March 15', recipients: 'Grade 12', date: '2026-03-07', status: 'Sent' },
  { id: 3, title: 'Parent-Teacher Conference', message: 'PTC scheduled for March 18, 2026', recipients: 'All Students', date: '2026-03-06', status: 'Sent' },
  { id: 4, title: 'Uniform Inspection', message: 'Proper uniform required starting Monday', recipients: 'All Students', date: '2026-03-05', status: 'Sent' }
];

const sampleDocumentRequests = [
  { id: 1, studentName: 'Juan Dela Cruz', lrn: '2024120001', document: 'Certificate of Enrollment', purpose: 'Scholarship', status: 'Pending', date: '2026-03-08' },
  { id: 2, studentName: 'Maria Garcia', lrn: '2024120002', document: 'Certificate of Good Moral', purpose: 'Job Application', status: 'Processing', date: '2026-03-07' },
  { id: 3, studentName: 'Pedro Reyes', lrn: '2024120003', document: 'Transcript of Records', purpose: 'Transfer', status: 'Ready', date: '2026-03-06' },
  { id: 4, studentName: 'Ana Lopez', lrn: '2024120004', document: 'Form 137', purpose: 'College Application', status: 'Pending', date: '2026-03-08' },
  { id: 5, studentName: 'Carlos Mendoza', lrn: '2024120005', document: 'Certificate of Enrollment', purpose: 'Scholarship', status: 'Completed', date: '2026-03-05' }
];

// Initialize Dashboard
function initDashboard() {
  currentSAO = sampleSAO;
  sections = sampleSections;
  notifications = sampleNotifications;
  documentRequests = sampleDocumentRequests;
  
  loadSAOProfile();
  loadDashboardStats();
  loadSectionFolders();
  loadNotifications();
  loadDocumentRequests();
  loadRecentActivities();
  loadAttendanceOverview();
  loadRecentReports();
}

// Load SAO Profile
function loadSAOProfile() {
  document.getElementById('sidebarSAOName').textContent = currentSAO.fullName.split(' ')[0];
  document.getElementById('sidebarProfilePic').src = currentSAO.profilePic;
}

// Load Dashboard Stats
function loadDashboardStats() {
  const totalStudents = sections.reduce((sum, s) => sum + s.students, 0);
  document.getElementById('totalStudents').textContent = totalStudents.toLocaleString();
  document.getElementById('totalSections').textContent = sections.length;
  document.getElementById('pendingRequests').textContent = documentRequests.filter(d => d.status === 'Pending').length;
  document.getElementById('unreadNotifications').textContent = notifications.length;
}

// Load Recent Activities
function loadRecentActivities() {
  const container = document.getElementById('recentActivities');
  const activities = [
    { icon: 'document-text', color: 'blue', text: 'New document request from Juan Dela Cruz', time: '10 minutes ago' },
    { icon: 'person-add', color: 'green', text: 'New student registered in Grade 7 - St. Anthony', time: '1 hour ago' },
    { icon: 'notifications', color: 'yellow', text: 'Notification sent to all Grade 12 students', time: '2 hours ago' },
    { icon: 'checkmark-circle', color: 'accent', text: 'Document approved for Maria Garcia', time: '3 hours ago' },
    { icon: 'calendar', color: 'blue', text: 'Attendance report generated for March', time: '5 hours ago' }
  ];
  
  container.innerHTML = activities.map(act => `
    <div class="bg-white/50 rounded-lg p-3 flex items-start gap-3">
      <ion-icon name="${act.icon}" class="text-2xl text-${act.color}-500 mt-1"></ion-icon>
      <div class="flex-1">
        <p class="text-sm text-lighter font-semibold">${act.text}</p>
        <p class="text-xs text-light">${act.time}</p>
      </div>
    </div>
  `).join('');
}

// Load Attendance Overview
function loadAttendanceOverview() {
  const container = document.getElementById('attendanceOverview');
  const grades = [7, 8, 9, 10, 11, 12];
  
  container.innerHTML = grades.map(grade => {
    const gradeSections = sections.filter(s => s.grade === grade);
    const totalStudents = gradeSections.reduce((sum, s) => sum + s.students, 0);
    const presentRate = Math.floor(Math.random() * 10) + 85; // 85-95%
    
    return `
      <div class="bg-white/50 rounded-lg p-4 text-center">
        <p class="text-sm font-semibold text-lighter">Grade ${grade}</p>
        <p class="text-2xl font-bold text-accent">${presentRate}%</p>
        <p class="text-xs text-light">${totalStudents} students</p>
      </div>
    `;
  }).join('');
}

// Load Section Folders
function loadSectionFolders() {
  const container = document.getElementById('sectionFolders');
  const filtered = filterSectionsList();
  
  container.innerHTML = filtered.map(section => `
    <div class="glass rounded-xl p-6 hover:shadow-lg transition cursor-pointer folder-card" onclick="viewSection('${section.name}', ${section.grade})">
      <div class="flex items-center justify-between mb-4">
        <ion-icon name="folder" class="text-4xl text-accent"></ion-icon>
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
          Grade ${section.grade}
        </span>
      </div>
      <h3 class="text-lg font-bold text-lighter mb-1">${section.name}</h3>
      ${section.strand ? `<p class="text-xs text-light mb-2">${section.strand}</p>` : ''}
      <p class="text-sm text-light">Adviser: ${section.adviser}</p>
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-light/20">
        <span class="text-xs text-light">Students</span>
        <span class="text-lg font-bold text-accent">${section.students}</span>
      </div>
    </div>
  `).join('');
}

// Filter Sections
function filterSectionsList() {
  const gradeFilter = document.getElementById('gradeFilter')?.value || 'all';
  const search = document.getElementById('sectionSearch')?.value.toLowerCase() || '';
  
  return sections.filter(section => {
    const matchesGrade = gradeFilter === 'all' || section.grade === parseInt(gradeFilter);
    const matchesSearch = section.name.toLowerCase().includes(search) || 
                         section.adviser.toLowerCase().includes(search) ||
                         (section.strand && section.strand.toLowerCase().includes(search));
    return matchesGrade && matchesSearch;
  });
}

function filterSections() {
  loadSectionFolders();
}

// Load Notifications
function loadNotifications() {
  const container = document.getElementById('notificationsList');
  
  if (notifications.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No notifications</div>';
    return;
  }
  
  container.innerHTML = notifications.map(notif => `
    <div class="glass rounded-xl p-4 hover:shadow-lg transition">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <ion-icon name="notifications" class="text-2xl text-accent"></ion-icon>
            <h3 class="font-semibold text-lighter">${notif.title}</h3>
          </div>
          <p class="text-sm text-light mb-2">${notif.message}</p>
          <div class="flex items-center gap-4 text-xs text-light">
            <span><ion-icon name="people" class="text-sm"></ion-icon> ${notif.recipients}</span>
            <span><ion-icon name="calendar" class="text-sm"></ion-icon> ${notif.date}</span>
            <span class="px-2 py-1 rounded-full bg-green-100 text-green-700">${notif.status}</span>
          </div>
        </div>
        <button onclick="deleteNotification(${notif.id})" class="text-red-500 hover:text-red-700">
          <ion-icon name="trash" class="text-xl"></ion-icon>
        </button>
      </div>
    </div>
  `).join('');
}

// Load Document Requests
function loadDocumentRequests() {
  const container = document.getElementById('documentRequests');
  const filtered = filterDocumentsList();
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No document requests</div>';
    return;
  }
  
  container.innerHTML = filtered.map(doc => `
    <div class="glass rounded-xl p-4 hover:shadow-lg transition">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ion-icon name="document-text" class="text-xl text-accent"></ion-icon>
            </div>
            <div>
              <p class="font-semibold text-lighter">${doc.studentName}</p>
              <p class="text-xs text-light">LRN: ${doc.lrn}</p>
            </div>
          </div>
          <div class="ml-13 space-y-1">
            <p class="text-sm text-light">Document: <span class="font-semibold text-lighter">${doc.document}</span></p>
            <p class="text-sm text-light">Purpose: ${doc.purpose}</p>
            <p class="text-xs text-light">Requested: ${doc.date}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${
            doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            doc.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
            doc.status === 'Ready' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }">${doc.status}</span>
          ${doc.status === 'Pending' ? `
            <button onclick="processDocument(${doc.id})" class="bg-primary text-lighter px-4 py-2 rounded-lg hover:bg-secondary transition text-sm">
              Process
            </button>
          ` : doc.status === 'Processing' ? `
            <button onclick="markReady(${doc.id})" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">
              Mark Ready
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// Filter Documents
function filterDocumentsList() {
  const statusFilter = document.getElementById('docStatusFilter')?.value || 'all';
  const search = document.getElementById('docSearch')?.value.toLowerCase() || '';
  
  return documentRequests.filter(doc => {
    const matchesStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter;
    const matchesSearch = doc.studentName.toLowerCase().includes(search) || 
                         doc.lrn.includes(search) ||
                         doc.document.toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });
}

function filterDocuments() {
  loadDocumentRequests();
}

// Load Recent Reports
function loadRecentReports() {
  const container = document.getElementById('recentReports');
  const reports = [
    { name: 'Monthly Attendance Report - February 2026', date: '2026-03-01', type: 'Attendance' },
    { name: 'Enrollment Summary - SY 2025-2026', date: '2026-02-28', type: 'Enrollment' },
    { name: 'Document Requests Report - February', date: '2026-02-27', type: 'Documents' }
  ];
  
  container.innerHTML = reports.map(report => `
    <div class="bg-white/50 rounded-lg p-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <ion-icon name="document" class="text-2xl text-accent"></ion-icon>
        <div>
          <p class="text-sm font-semibold text-lighter">${report.name}</p>
          <p class="text-xs text-light">${report.date} • ${report.type}</p>
        </div>
      </div>
      <button onclick="downloadReport('${report.name}')" class="text-accent hover:text-secondary">
        <ion-icon name="download" class="text-xl"></ion-icon>
      </button>
    </div>
  `).join('');
}

// Section Navigation
function showSection(section) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  
  document.getElementById(section + 'Section').classList.add('active');
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
}

// Search Content
function searchContent(query) {
  console.log('Searching for:', query);
}

// View Section
function viewSection(name, grade) {
  const section = sections.find(s => s.name === name && s.grade === grade);
  const modal = document.getElementById('sectionModal');
  const title = document.getElementById('sectionModalTitle');
  const details = document.getElementById('sectionDetails');
  
  title.textContent = `Grade ${grade} - ${name}`;
  
  details.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><span class="text-light">Grade Level:</span> <span class="font-semibold text-lighter">Grade ${section.grade}</span></div>
        <div><span class="text-light">Section:</span> <span class="font-semibold text-lighter">${section.name}</span></div>
        ${section.strand ? `<div><span class="text-light">Strand:</span> <span class="font-semibold text-lighter">${section.strand}</span></div>` : ''}
        <div><span class="text-light">Adviser:</span> <span class="font-semibold text-lighter">${section.adviser}</span></div>
        <div><span class="text-light">Total Students:</span> <span class="font-semibold text-lighter">${section.students}</span></div>
      </div>
      <div class="flex gap-3 mt-6">
        <button onclick="viewMasterlist('${section.name}', ${section.grade})" class="flex-1 bg-primary text-lighter py-2 rounded-lg hover:bg-secondary transition">
          View Masterlist
        </button>
        <button onclick="viewAttendance('${section.name}', ${section.grade})" class="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-secondary transition">
          View Attendance
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function closeSectionModal() {
  document.getElementById('sectionModal').classList.remove('active');
}

// Send Notification
function sendNotification() {
  document.getElementById('notificationModal').classList.add('active');
}

function closeNotificationModal() {
  document.getElementById('notificationModal').classList.remove('active');
}

function submitNotification(event) {
  event.preventDefault();
  
  const newNotif = {
    id: notifications.length + 1,
    title: document.getElementById('notificationTitle').value,
    message: document.getElementById('notificationMessage').value,
    recipients: document.getElementById('notificationRecipients').options[document.getElementById('notificationRecipients').selectedIndex].text,
    date: new Date().toISOString().split('T')[0],
    status: 'Sent'
  };
  
  notifications.unshift(newNotif);
  closeNotificationModal();
  loadNotifications();
  loadDashboardStats();
  
  alert('Notification sent successfully!');
  event.target.reset();
}

// Delete Notification
function deleteNotification(id) {
  if (confirm('Are you sure you want to delete this notification?')) {
    notifications = notifications.filter(n => n.id !== id);
    loadNotifications();
    alert('Notification deleted');
  }
}

// Process Document
function processDocument(id) {
  const doc = documentRequests.find(d => d.id === id);
  doc.status = 'Processing';
  loadDocumentRequests();
  alert('Document is now being processed');
}

// Mark Ready
function markReady(id) {
  const doc = documentRequests.find(d => d.id === id);
  doc.status = 'Ready';
  loadDocumentRequests();
  alert('Document is ready for pickup');
}

// Quick Actions
function generateReport() {
  alert('Generating report...');
}

function viewAllStudents() {
  alert('Viewing all students...');
}

function manageDocuments() {
  showSection('documents');
}

// Reports
function generateAttendanceReport() {
  alert('Generating attendance report...');
}

function generateEnrollmentReport() {
  alert('Generating enrollment report...');
}

function generateDocumentReport() {
  alert('Generating document report...');
}

function downloadReport(name) {
  alert(`Downloading: ${name}`);
}

// View Masterlist
function viewMasterlist(section, grade) {
  alert(`Viewing masterlist for Grade ${grade} - ${section}`);
}

// View Attendance
function viewAttendance(section, grade) {
  alert(`Viewing attendance for Grade ${grade} - ${section}`);
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
