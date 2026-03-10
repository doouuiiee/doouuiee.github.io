// ============================================
// ATTENDANCE SHEET - Supervisory Committee
// ============================================

let currentStudent = null;
let currentSubject = null;
let attendanceData = {};
let studentList = [];
let submissionStatus = {}; // Track which subjects are submitted
let supervisoryCommitteeData = {
  section: {},
  subjects: []
};

const API_URL = 'http://localhost:5000/api';

// Initialize
async function initAttendanceSheet() {
  // Set current date
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
  
  // Load data from API
  await loadStudentData();
  await loadSectionData();
  await loadSubjects();
  await loadClassmates();
  
  // Load subject tabs
  loadSubjectTabs();
  
  // Load first subject
  if (supervisoryCommitteeData.subjects.length > 0) {
    selectSubject(supervisoryCommitteeData.subjects[0].id);
  }
}

// Load logged-in student data
async function loadStudentData() {
  try {
    // Get current user from localStorage or session
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      window.location.href = 'index.html';
      return;
    }
    
    // Fetch student data from API
    // const response = await fetch(`${API_URL}/auth/me`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // const data = await response.json();
    // return data.user;
  } catch (error) {
    console.error('Error loading student data:', error);
  }
}

// Load section data
async function loadSectionData() {
  try {
    // Fetch section data from API
    // const response = await fetch(`${API_URL}/sections/${sectionId}`);
    // const data = await response.json();
    // supervisoryCommitteeData.section = data.section;
    
    // Temporary: Set placeholder
    supervisoryCommitteeData.section = {
      grade: 'Grade 12',
      name: 'St. Margaret',
      strand: 'STEM',
      adviser: 'TBA'
    };
    
    const section = supervisoryCommitteeData.section;
    document.getElementById('sectionName').textContent = 
      `${section.grade} - ${section.name}${section.strand ? ' (' + section.strand + ')' : ''}`;
    document.getElementById('adviserName').textContent = section.adviser;
  } catch (error) {
    console.error('Error loading section data:', error);
  }
}

// Load subjects
async function loadSubjects() {
  try {
    // Fetch subjects from API
    // const response = await fetch(`${API_URL}/subjects?sectionId=${sectionId}`);
    // const data = await response.json();
    // supervisoryCommitteeData.subjects = data.subjects;
    
    // Temporary: Set placeholder
    supervisoryCommitteeData.subjects = [];
  } catch (error) {
    console.error('Error loading subjects:', error);
  }
}

// Load classmates
async function loadClassmates() {
  try {
    // Fetch students from API
    // const response = await fetch(`${API_URL}/students?sectionId=${sectionId}`);
    // const data = await response.json();
    // studentList = data.students;
    
    // Temporary: Set empty
    studentList = [];
  } catch (error) {
    console.error('Error loading classmates:', error);
  }
}

// Load subject tabs
function loadSubjectTabs() {
  const tabsContainer = document.getElementById('subjectTabs');
  
  tabsContainer.innerHTML = supervisoryCommitteeData.subjects.map(subject => `
    <button 
      class="subject-tab glass px-6 py-3 rounded-lg text-white font-semibold whitespace-nowrap ${submissionStatus[subject.id] ? 'submitted' : ''}"
      onclick="selectSubject(${subject.id})"
      data-subject-id="${subject.id}"
    >
      <div class="text-left">
        <div class="font-bold">${subject.name}</div>
        <div class="text-xs opacity-80">${subject.schedule}</div>
      </div>
    </button>
  `).join('');
}

// Select subject
function selectSubject(subjectId) {
  currentSubject = supervisoryCommitteeData.subjects.find(s => s.id === subjectId);
  
  // Update active tab
  document.querySelectorAll('.subject-tab').forEach(tab => {
    if (tab.dataset.subjectId == subjectId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update subject info
  document.getElementById('currentSubject').textContent = currentSubject.name;
  document.getElementById('currentTeacher').textContent = `Teacher: ${currentSubject.teacher}`;
  document.getElementById('currentSchedule').textContent = `Schedule: ${currentSubject.schedule}`;
  document.getElementById('totalStudents').textContent = studentList.length;
  
  // Update submission status display
  updateSubmissionStatusDisplay();
  
  // Initialize attendance data for this subject if not exists
  if (!attendanceData[subjectId]) {
    attendanceData[subjectId] = {};
    studentList.forEach(student => {
      attendanceData[subjectId][student.id] = {
        status: null,
        minutes: null
      };
    });
  }
  
  // Render table
  renderAttendanceTable();
  updateSummary();
}

// Update submission status display
function updateSubmissionStatusDisplay() {
  const statusBadge = document.getElementById('submissionStatus');
  const submittedAtText = document.getElementById('submittedAt');
  
  if (submissionStatus[currentSubject.id]) {
    statusBadge.textContent = '✓ Submitted';
    statusBadge.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white';
    submittedAtText.textContent = submissionStatus[currentSubject.id].timestamp;
  } else {
    statusBadge.textContent = 'Not Submitted';
    statusBadge.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-white';
    submittedAtText.textContent = 'Not yet submitted';
  }
}

// Render attendance table
function renderAttendanceTable() {
  const tbody = document.getElementById('attendanceTableBody');
  const subjectAttendance = attendanceData[currentSubject.id];
  
  tbody.innerHTML = studentList.map((student, index) => {
    const attendance = subjectAttendance[student.id];
    const statusDisplay = getStatusDisplay(attendance);
    
    return `
      <tr class="border-b border-primary/20 hover:bg-white/10 transition">
        <td class="py-3 px-3 text-white">${index + 1}</td>
        <td class="py-3 px-3 text-white">${student.lrn}</td>
        <td class="py-3 px-3 text-white">${student.name}</td>
        <td class="py-3 px-3 text-white">${student.position}</td>
        <td class="py-3 px-3 no-print">
          <div class="flex gap-2 justify-center flex-wrap">
            <button 
              onclick="markAttendance(${student.id}, 'present')"
              class="attendance-btn bg-green-500 text-white hover:bg-green-600"
            >
              Present
            </button>
            <button 
              onclick="markAttendance(${student.id}, 'absent')"
              class="attendance-btn bg-red-500 text-white hover:bg-red-600"
            >
              Absent
            </button>
            <button 
              onclick="openLateModal(${student.id})"
              class="attendance-btn bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Late
            </button>
            <button 
              onclick="markAttendance(${student.id}, 'excused')"
              class="attendance-btn bg-blue-500 text-white hover:bg-blue-600"
            >
              Excused
            </button>
          </div>
        </td>
        <td class="py-3 px-3 text-center">
          ${statusDisplay}
        </td>
      </tr>
    `;
  }).join('');
}

// Get status display
function getStatusDisplay(attendance) {
  if (!attendance.status) {
    return '<span class="text-white text-sm">Not marked</span>';
  }
  
  const colors = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    excused: 'bg-blue-100 text-blue-700'
  };
  
  const labels = {
    present: 'Present',
    absent: 'Absent',
    late: `Late (${attendance.minutes} min)`,
    excused: 'Excused'
  };
  
  return `
    <span class="px-3 py-1 rounded-full text-xs font-semibold ${colors[attendance.status]}">
      ${labels[attendance.status]}
    </span>
  `;
}

// Mark attendance
function markAttendance(studentId, status) {
  attendanceData[currentSubject.id][studentId] = {
    status: status,
    minutes: null
  };
  
  renderAttendanceTable();
  updateSummary();
}

// Open late modal
function openLateModal(studentId) {
  currentStudent = studentList.find(s => s.id === studentId);
  document.getElementById('lateStudentName').textContent = currentStudent.name;
  document.getElementById('lateMinutes').value = '';
  document.getElementById('lateModal').classList.remove('hidden');
  document.getElementById('lateMinutes').focus();
}

// Close late modal
function closeLateModal() {
  document.getElementById('lateModal').classList.add('hidden');
  currentStudent = null;
}

// Confirm late
function confirmLate() {
  const minutes = parseInt(document.getElementById('lateMinutes').value);
  
  if (!minutes || minutes < 1) {
    alert('Please enter valid minutes');
    return;
  }
  
  attendanceData[currentSubject.id][currentStudent.id] = {
    status: 'late',
    minutes: minutes
  };
  
  closeLateModal();
  renderAttendanceTable();
  updateSummary();
}

// Update summary
function updateSummary() {
  const subjectAttendance = attendanceData[currentSubject.id];
  
  let present = 0, absent = 0, late = 0, excused = 0;
  
  Object.values(subjectAttendance).forEach(attendance => {
    if (attendance.status === 'present') present++;
    else if (attendance.status === 'absent') absent++;
    else if (attendance.status === 'late') late++;
    else if (attendance.status === 'excused') excused++;
  });
  
  document.getElementById('summaryPresent').textContent = present;
  document.getElementById('summaryAbsent').textContent = absent;
  document.getElementById('summaryLate').textContent = late;
  document.getElementById('summaryExcused').textContent = excused;
}

// Submit current subject
function submitCurrentSubject() {
  // Check if all students are marked
  const subjectAttendance = attendanceData[currentSubject.id];
  const unmarked = Object.values(subjectAttendance).filter(a => !a.status).length;
  
  if (unmarked > 0) {
    if (!confirm(`${unmarked} student(s) not marked. Submit anyway?`)) {
      return;
    }
  }
  
  // Check if already submitted
  if (submissionStatus[currentSubject.id]) {
    if (!confirm('This subject has already been submitted. Submit again?')) {
      return;
    }
  }
  
  // In real implementation, send to API
  console.log('Submitting attendance:', {
    subject: currentSubject,
    date: new Date(),
    attendance: subjectAttendance
  });
  
  // Mark as submitted
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  submissionStatus[currentSubject.id] = {
    timestamp: `Today at ${timeString}`,
    data: { ...subjectAttendance }
  };
  
  // Update displays
  updateSubmissionStatusDisplay();
  loadSubjectTabs(); // Refresh tabs to show checkmark
  
  // Re-select current subject to maintain active state
  document.querySelector(`[data-subject-id="${currentSubject.id}"]`).classList.add('active');
  
  alert(`Attendance for ${currentSubject.name} submitted successfully!`);
  
  // Check if all subjects are submitted
  checkAllSubmitted();
}

// Check if all subjects are submitted
function checkAllSubmitted() {
  const totalSubjects = supervisoryCommitteeData.subjects.length;
  const submittedCount = Object.keys(submissionStatus).length;
  
  if (submittedCount === totalSubjects) {
    setTimeout(() => {
      alert(`All ${totalSubjects} subjects submitted! Great job! 🎉`);
    }, 500);
  }
}

// Save attendance (auto-save feature)
function saveAttendance() {
  // Auto-save current progress without submitting
  console.log('Auto-saving attendance:', {
    subject: currentSubject,
    attendance: attendanceData[currentSubject.id]
  });
}

// Print sheet
function printSheet() {
  window.print();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initAttendanceSheet);
