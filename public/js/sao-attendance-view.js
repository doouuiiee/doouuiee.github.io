// ============================================
// SAO ATTENDANCE VIEW - Read-Only Records
// ============================================

let currentDate = new Date();
let currentSection = null;
let currentSubject = null;
let attendanceRecords = [];

const API_URL = 'http://localhost:5000/api';

// Initialize
function initSAOAttendanceView() {
  // Set today's date
  const today = new Date();
  document.getElementById('dateFilter').valueAsDate = today;
  updateDateDisplay();
}

// Update date display
function updateDateDisplay() {
  const dateInput = document.getElementById('dateFilter');
  currentDate = new Date(dateInput.value);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('sheetDate').textContent = 
    `Date: ${currentDate.toLocaleDateString('en-US', options)}`;
}

// Filter sections by grade
function filterSections() {
  const gradeFilter = document.getElementById('gradeFilter').value;
  const sectionSelect = document.getElementById('sectionFilter');
  const subjectSelect = document.getElementById('subjectFilter');
  
  sectionSelect.innerHTML = '<option value="">Select Section</option>';
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  
  if (!gradeFilter) {
    sectionSelect.disabled = true;
    subjectSelect.disabled = true;
    return;
  }
  
  sectionSelect.disabled = false;
  const grade = `Grade ${gradeFilter}`;
  
  if (sectionData[grade]) {
    if (grade === 'Grade 11' || grade === 'Grade 12') {
      // Handle strands
      Object.keys(sectionData[grade].strands).forEach(strand => {
        const sections = sectionData[grade].strands[strand].sections;
        sections.forEach(section => {
          const option = document.createElement('option');
          option.value = `${grade}|${strand}|${section.name}`;
          option.textContent = `${section.name} (${strand})`;
          sectionSelect.appendChild(option);
        });
      });
    } else {
      // Regular sections
      sectionData[grade].sections.forEach(section => {
        const option = document.createElement('option');
        option.value = `${grade}||${section.name}`;
        option.textContent = section.name;
        sectionSelect.appendChild(option);
      });
    }
  }
}

// Load attendance records
async function loadAttendanceRecords() {
  const dateValue = document.getElementById('dateFilter').value;
  const sectionValue = document.getElementById('sectionFilter').value;
  const subjectSelect = document.getElementById('subjectFilter');
  
  if (!dateValue || !sectionValue) {
    document.getElementById('attendanceTableBody').innerHTML = 
      '<tr><td colspan="7" class="text-center py-8 text-white">Please select date, grade, and section</td></tr>';
    return;
  }
  
  const [grade, strand, sectionName] = sectionValue.split('|');
  currentSection = { grade, strand, sectionName };
  
  // Update section info
  document.getElementById('sheetSection').textContent = 
    strand ? `${grade} - ${sectionName} (${strand})` : `${grade} - ${sectionName}`;
  
  // Get section details
  const sectionInfo = getSectionByName(sectionName);
  document.getElementById('sheetAdviser').textContent = sectionInfo?.adviser || 'TBA';
  
  try {
    // Fetch subjects from API
    // const response = await fetch(`${API_URL}/subjects?grade=${grade}&section=${sectionName}`);
    // const data = await response.json();
    // const subjects = data.subjects;
    
    // Temporary: Show message
    subjectSelect.innerHTML = '<option value="">No subjects found - Register students first</option>';
    subjectSelect.disabled = true;
  } catch (error) {
    console.error('Error loading subjects:', error);
    subjectSelect.innerHTML = '<option value="">Error loading subjects</option>';
    subjectSelect.disabled = true;
  }
}

// Load subject attendance
async function loadSubjectAttendance() {
  const subjectId = parseInt(document.getElementById('subjectFilter').value);
  
  if (!subjectId || !currentSection) {
    return;
  }
  
  try {
    // Fetch attendance from API
    const dateValue = document.getElementById('dateFilter').value;
    // const response = await fetch(`${API_URL}/attendance?date=${dateValue}&subjectId=${subjectId}`);
    // const data = await response.json();
    // attendanceRecords = data.records;
    // currentSubject = data.subject;
    
    // Temporary: Show empty message
    attendanceRecords = [];
    document.getElementById('attendanceTableBody').innerHTML = 
      '<tr><td colspan="7" class="text-center py-8 text-white">No attendance records found for this date and subject</td></tr>';
    
    document.getElementById('sheetTotal').textContent = '0';
    document.getElementById('recordedBy').textContent = '-';
    document.getElementById('submittedAt').textContent = '-';
    
    updateSummary();
  } catch (error) {
    console.error('Error loading attendance:', error);
    document.getElementById('attendanceTableBody').innerHTML = 
      '<tr><td colspan="7" class="text-center py-8 text-white">Error loading attendance records</td></tr>';
  }
}

// Render attendance table (READ-ONLY)
function renderAttendanceTable() {
  const tbody = document.getElementById('attendanceTableBody');
  
  tbody.innerHTML = attendanceRecords.map((student, index) => `
    <tr class="border-b border-primary/20">
      <td class="py-3 px-2 text-white">${index + 1}</td>
      <td class="py-3 px-2 text-white">${student.lrn}</td>
      <td class="py-3 px-2 text-white">${student.name}</td>
      <td class="py-3 px-2 text-white">${student.position}</td>
      <td class="py-3 px-2 text-center text-white">${student.timeIn}</td>
      <td class="py-3 px-2 text-center">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}">
          ${student.status}
        </span>
      </td>
      <td class="py-3 px-2 text-white">${student.remarks}</td>
    </tr>
  `).join('');
}

// Get status color
function getStatusColor(status) {
  switch(status) {
    case 'Present': return 'bg-green-100 text-green-700';
    case 'Late': return 'bg-yellow-100 text-yellow-700';
    case 'Absent': return 'bg-red-100 text-red-700';
    case 'Excused': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

// Update summary
function updateSummary() {
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(s => s.status === 'Present').length;
  const absent = attendanceRecords.filter(s => s.status === 'Absent').length;
  const late = attendanceRecords.filter(s => s.status === 'Late').length;
  const excused = attendanceRecords.filter(s => s.status === 'Excused').length;
  
  document.getElementById('summaryTotal').textContent = total;
  document.getElementById('summaryPresent').textContent = present;
  document.getElementById('summaryAbsent').textContent = absent;
  document.getElementById('summaryLate').textContent = late;
  document.getElementById('summaryExcused').textContent = excused;
}

// Print sheet
function printSheet() {
  window.print();
}

// Export sheet
function exportSheet() {
  const element = document.getElementById('attendanceSheetContainer');
  const opt = {
    margin: 0.5,
    filename: `attendance-${currentSection.sectionName}-${currentDate.toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initSAOAttendanceView);
