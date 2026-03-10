// ============================================
// TEACHER DASHBOARD - Frontend Logic
// ============================================

const API_URL = 'http://localhost:5000/api';
let currentTeacher = null;
let advisoryStudents = [];
let subjects = [];
let appointments = [];

// Initialize Dashboard
async function initDashboard() {
  try {
    // Load data from API
    await loadTeacherData();
    await loadAdvisoryStudents();
    await loadSubjects();
    await loadAppointments();
    
    loadTeacherProfile();
    loadDashboardStats();
    loadMasterlist();
    loadSubjects();
    loadAppointments();
    loadRecentActivities();
    loadUpcomingAppointments();
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    alert('Error loading dashboard data. Please refresh the page.');
  }
}

// Load teacher data from API
async function loadTeacherData() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      window.location.href = 'index.html';
      return;
    }
    
    // Fetch teacher data
    // const response = await fetch(`${API_URL}/auth/me`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // const data = await response.json();
    // currentTeacher = data.user.teacher;
    
    // Temporary placeholder
    currentTeacher = {
      employeeId: 'T-2024-001',
      fullName: 'Teacher Name',
      advisorySection: 'Not Assigned',
      office: 'Faculty',
      email: 'teacher@cccs.edu',
      profilePic: 'https://via.placeholder.com/150'
    };
  } catch (error) {
    console.error('Error loading teacher data:', error);
  }
}

// Load advisory students
async function loadAdvisoryStudents() {
  try {
    // Fetch from API
    // const response = await fetch(`${API_URL}/teachers/advisory-students`);
    // const data = await response.json();
    // advisoryStudents = data.students;
    
    // Temporary: empty array
    advisoryStudents = [];
  } catch (error) {
    console.error('Error loading advisory students:', error);
  }
}

// Load subjects
async function loadSubjects() {
  try {
    // Fetch from API
    // const response = await fetch(`${API_URL}/teachers/subjects`);
    // const data = await response.json();
    // subjects = data.subjects;
    
    // Temporary: empty array
    subjects = [];
  } catch (error) {
    console.error('Error loading subjects:', error);
  }
}

// Load appointments
async function loadAppointments() {
  try {
    // Fetch from API
    // const response = await fetch(`${API_URL}/appointments`);
    // const data = await response.json();
    // appointments = data.appointments;
    
    // Temporary: empty array
    appointments = [];
  } catch (error) {
    console.error('Error loading appointments:', error);
  }
}

// Load Teacher Profile
function loadTeacherProfile() {
  document.getElementById('sidebarTeacherName').textContent = currentTeacher.fullName.split(' ')[0];
  document.getElementById('sidebarProfilePic').src = currentTeacher.profilePic;
  document.getElementById('teacherGreeting').textContent = currentTeacher.fullName.split(' ')[0];
  document.getElementById('profilePic').src = currentTeacher.profilePic;
  document.getElementById('profileName').textContent = currentTeacher.fullName;
  document.getElementById('profileID').textContent = currentTeacher.employeeId;
  document.getElementById('profileAdvisory').textContent = currentTeacher.advisorySection;
  document.getElementById('profileOffice').textContent = currentTeacher.office;
  document.getElementById('profileEmail').textContent = currentTeacher.email;
  
  // Quick stats
  document.getElementById('advisoryCount').textContent = advisoryStudents.length;
  document.getElementById('subjectCount').textContent = subjects.length;
  document.getElementById('totalStudents').textContent = subjects.reduce((sum, s) => sum + s.students, 0);
  document.getElementById('pendingAppointments').textContent = appointments.filter(a => a.status === 'Pending').length;
}

// Load Dashboard Stats
function loadDashboardStats() {
  document.getElementById('dashAdvisory').textContent = advisoryStudents.length;
  document.getElementById('dashSubjects').textContent = subjects.length;
  document.getElementById('dashAppointments').textContent = appointments.length;
  document.getElementById('dashOfficers').textContent = advisoryStudents.filter(s => s.position !== 'Regular').length;
}

// Load Recent Activities
function loadRecentActivities() {
  const container = document.getElementById('recentActivities');
  const activities = [
    { icon: 'checkmark-circle', color: 'green', text: 'Attendance submitted for Grade 12 - St. Margaret', time: '2 hours ago' },
    { icon: 'document-text', color: 'blue', text: 'Grade report uploaded for Statistics', time: '5 hours ago' },
    { icon: 'person-add', color: 'accent', text: 'New student registered in advisory class', time: '1 day ago' },
    { icon: 'calendar', color: 'yellow', text: 'Appointment confirmed with Juan Dela Cruz', time: '2 days ago' }
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

// Load Upcoming Appointments
function loadUpcomingAppointments() {
  const container = document.getElementById('upcomingAppointmentsList');
  const upcoming = appointments.slice(0, 5);
  
  if (upcoming.length === 0) {
    container.innerHTML = '<p class="text-sm text-light">No upcoming appointments</p>';
    return;
  }
  
  container.innerHTML = upcoming.map(apt => `
    <div class="bg-white/50 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <p class="font-semibold text-lighter">${apt.studentName}</p>
        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }">${apt.status}</span>
      </div>
      <p class="text-xs text-light">${apt.date} at ${apt.time}</p>
      <p class="text-xs text-light mt-1">${apt.purpose}</p>
    </div>
  `).join('');
}

// Load Masterlist
function loadMasterlist() {
  const container = document.getElementById('masterlistTable');
  const filtered = filterStudentsList();
  
  container.innerHTML = filtered.map((student, index) => `
    <tr class="border-b border-light/20 student-row">
      <td class="py-3 px-4 text-lighter">${index + 1}</td>
      <td class="py-3 px-4 text-lighter">${student.lrn}</td>
      <td class="py-3 px-4 text-lighter font-semibold">${student.name}</td>
      <td class="py-3 px-4 text-lighter">${student.gender}</td>
      <td class="py-3 px-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${
          student.position === 'Regular' ? 'bg-gray-100 text-gray-700' : 'bg-accent/20 text-accent'
        }">${student.position}</span>
      </td>
      <td class="py-3 px-4 text-lighter">${student.contact}</td>
      <td class="py-3 px-4">
        <button onclick="viewStudent(${student.id})" class="text-accent hover:text-secondary">
          <ion-icon name="eye" class="text-xl"></ion-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

// Filter Students
function filterStudentsList() {
  const search = document.getElementById('studentSearch')?.value.toLowerCase() || '';
  const filter = document.getElementById('officerFilter')?.value || 'all';
  
  return advisoryStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search) || student.lrn.includes(search);
    const matchesFilter = filter === 'all' || 
                         (filter === 'officers' && student.position !== 'Regular') ||
                         (filter === 'regular' && student.position === 'Regular');
    return matchesSearch && matchesFilter;
  });
}

function filterStudents() {
  loadMasterlist();
}

// Load Subjects
function loadSubjects() {
  const container = document.getElementById('subjectsList');
  container.innerHTML = subjects.map(subject => `
    <div class="glass rounded-xl p-6 hover:shadow-lg transition">
      <div class="flex items-center justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-lighter">${subject.name}</h3>
          <p class="text-sm text-light">${subject.section}</p>
          <p class="text-xs text-light mt-1">${subject.schedule}</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-accent">${subject.students}</p>
          <p class="text-xs text-light">Students</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="viewSubjectDetails(${subject.id})" class="flex-1 bg-primary text-lighter py-2 rounded-lg hover:bg-secondary transition text-sm">
          View Details
        </button>
        <button onclick="takeAttendance(${subject.id})" class="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-secondary transition text-sm">
          Take Attendance
        </button>
      </div>
    </div>
  `).join('');
}

// Load Appointments
function loadAppointments() {
  const container = document.getElementById('appointmentsList');
  
  if (appointments.length === 0) {
    container.innerHTML = '<div class="glass rounded-xl p-6 text-center text-light">No appointment requests</div>';
    return;
  }
  
  container.innerHTML = appointments.map(apt => `
    <div class="glass rounded-xl p-4 hover:shadow-lg transition">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <p class="font-semibold text-lighter">${apt.studentName}</p>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${
              apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
              apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }">${apt.status}</span>
          </div>
          <p class="text-sm text-light">${apt.date} at ${apt.time}</p>
          <p class="text-sm text-light">Purpose: ${apt.purpose}</p>
          <p class="text-xs text-light mt-1">${apt.notes}</p>
        </div>
        ${apt.status === 'Pending' ? `
          <div class="flex gap-2">
            <button onclick="confirmAppointment(${apt.id})" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">
              Confirm
            </button>
            <button onclick="declineAppointment(${apt.id})" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">
              Decline
            </button>
          </div>
        ` : ''}
      </div>
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

// Upload Photo
function uploadPhoto() {
  alert('Photo upload functionality - Connect to backend API');
}

// Assign Officers
function assignOfficers() {
  const modal = document.getElementById('officersModal');
  const form = document.getElementById('officersForm');
  
  // Classroom Officers Structure
  const positions = [
    // Board of Directors
    'BOD Chairperson',
    'BOD Vice-Chairperson',
    'BOD Secretary',
    'BOD Member 1',
    'BOD Member 2',
    'BOD Member 3',
    'BOD Member 4',
    // Credit Committee
    'Credit Chairperson',
    'Credit Vice-Chairperson',
    'Credit Secretary',
    // Supervisory Committee
    'Supervisory Chairperson',
    'Supervisory Vice-Chairperson',
    'Supervisory Secretary',
    // Election Committee
    'Election Chairperson',
    'Election Vice-Chairperson',
    'Election Secretary'
  ];
  
  form.innerHTML = positions.map(position => `
    <div>
      <label class="block text-sm font-semibold text-light mb-1">${position}</label>
      <select class="w-full px-4 py-2 rounded-lg border-2 border-primary focus:outline-none" name="${position}">
        <option value="">Select Student</option>
        ${advisoryStudents.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>
  `).join('') + `
    <button type="submit" class="w-full bg-primary text-lighter py-3 rounded-lg font-semibold hover:bg-secondary transition mt-4">
      Save Officers
    </button>
  `;
  
  modal.classList.add('active');
}

function closeOfficersModal() {
  document.getElementById('officersModal').classList.remove('active');
}

function submitOfficers(event) {
  event.preventDefault();
  alert('Officers assigned successfully!');
  closeOfficersModal();
  loadMasterlist();
}

// View Student
function viewStudent(id) {
  const student = advisoryStudents.find(s => s.id === id);
  const modal = document.getElementById('studentModal');
  const details = document.getElementById('studentDetails');
  
  details.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><span class="text-light">LRN:</span> <span class="font-semibold text-lighter">${student.lrn}</span></div>
        <div><span class="text-light">Name:</span> <span class="font-semibold text-lighter">${student.name}</span></div>
        <div><span class="text-light">Gender:</span> <span class="font-semibold text-lighter">${student.gender}</span></div>
        <div><span class="text-light">Position:</span> <span class="font-semibold text-lighter">${student.position}</span></div>
        <div><span class="text-light">Contact:</span> <span class="font-semibold text-lighter">${student.contact}</span></div>
        <div><span class="text-light">Email:</span> <span class="font-semibold text-lighter">${student.email}</span></div>
      </div>
      <div class="flex gap-3 mt-6">
        <button onclick="viewAttendance(${student.id})" class="flex-1 bg-primary text-lighter py-2 rounded-lg hover:bg-secondary transition">
          View Attendance
        </button>
        <button onclick="viewGrades(${student.id})" class="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-secondary transition">
          View Grades
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function closeStudentModal() {
  document.getElementById('studentModal').classList.remove('active');
}

// Export Masterlist
function exportMasterlist() {
  alert('Exporting masterlist to Excel...');
}

// View Subject Details
function viewSubjectDetails(id) {
  const subject = subjects.find(s => s.id === id);
  alert(`Subject: ${subject.name}\nSection: ${subject.section}\nSchedule: ${subject.schedule}\nStudents: ${subject.students}`);
}

// Take Attendance
function takeAttendance(id) {
  const subject = subjects.find(s => s.id === id);
  alert(`Taking attendance for ${subject.name} - ${subject.section}`);
}

// Confirm Appointment
function confirmAppointment(id) {
  const apt = appointments.find(a => a.id === id);
  apt.status = 'Confirmed';
  loadAppointments();
  loadUpcomingAppointments();
  alert('Appointment confirmed!');
}

// Decline Appointment
function declineAppointment(id) {
  if (confirm('Are you sure you want to decline this appointment?')) {
    const apt = appointments.find(a => a.id === id);
    apt.status = 'Declined';
    loadAppointments();
    alert('Appointment declined');
  }
}

// View Attendance
function viewAttendance(studentId) {
  alert('Viewing attendance records for student ID: ' + studentId);
}

// View Grades
function viewGrades(studentId) {
  alert('Viewing grades for student ID: ' + studentId);
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
