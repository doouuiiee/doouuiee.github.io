// ============================================
// MAIN APP.JS - Frontend application logic
// ============================================

const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let currentProfile = null;

// Show/Hide Modals
function showLogin() {
  document.getElementById('loginModal').classList.remove('hidden');
  hideRegister();
}

function hideLogin() {
  document.getElementById('loginModal').classList.add('hidden');
}

function showRegister() {
  hideLogin();
  document.getElementById('registerModal').classList.remove('hidden');
  // Reset to role selection
  document.getElementById('roleSelection').classList.remove('hidden');
  document.getElementById('studentRegForm').classList.add('hidden');
  document.getElementById('teacherRegForm').classList.add('hidden');
}

function hideRegister() {
  document.getElementById('registerModal').classList.add('hidden');
}

// Role Selection
function selectRole(role) {
  document.getElementById('roleSelection').classList.add('hidden');
  if (role === 'student') {
    document.getElementById('studentRegForm').classList.remove('hidden');
    populateAdvisorySections();
  } else if (role === 'teacher') {
    document.getElementById('teacherRegForm').classList.remove('hidden');
    populateAdvisorySections();
  }
}

// Populate advisory sections for teacher registration
function populateAdvisorySections() {
  const select = document.getElementById('teacherAdvisory');
  select.innerHTML = '<option value="">Advisory Section (Optional)</option>';
  
  for (const grade in sectionData) {
    if (grade === 'Grade 11' || grade === 'Grade 12') {
      for (const strand in sectionData[grade].strands) {
        sectionData[grade].strands[strand].sections.forEach(section => {
          select.innerHTML += `<option value="${section}">${grade} - ${section} (${strand})</option>`;
        });
      }
    } else {
      sectionData[grade].sections.forEach(section => {
        select.innerHTML += `<option value="${section}">${grade} - ${section}</option>`;
      });
    }
  }
}

// Update grade levels based on education level
function updateGradeLevels() {
  const educationLevel = document.getElementById('studentEducationLevel').value;
  const gradeLevelDiv = document.getElementById('gradeLevelDiv');
  const gradeLevelSelect = document.getElementById('studentGradeLevel');
  const sectionDiv = document.getElementById('sectionDiv');
  const strandDiv = document.getElementById('strandDiv');
  
  gradeLevelSelect.innerHTML = '<option value="">Select Grade Level</option>';
  sectionDiv.classList.add('hidden');
  strandDiv.classList.add('hidden');
  
  if (!educationLevel) {
    gradeLevelDiv.classList.add('hidden');
    return;
  }
  
  gradeLevelDiv.classList.remove('hidden');
  
  if (educationLevel === 'Junior High') {
    gradeLevelSelect.innerHTML += '<option value="Grade 7">Grade 7</option>';
    gradeLevelSelect.innerHTML += '<option value="Grade 8">Grade 8</option>';
    gradeLevelSelect.innerHTML += '<option value="Grade 9">Grade 9</option>';
    gradeLevelSelect.innerHTML += '<option value="Grade 10">Grade 10</option>';
  } else if (educationLevel === 'Senior High') {
    gradeLevelSelect.innerHTML += '<option value="Grade 11">Grade 11</option>';
    gradeLevelSelect.innerHTML += '<option value="Grade 12">Grade 12</option>';
  }
}

// Update sections based on grade level
function updateSections() {
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const sectionDiv = document.getElementById('sectionDiv');
  const sectionSelect = document.getElementById('studentSection');
  const strandDiv = document.getElementById('strandDiv');
  const passwordInput = document.getElementById('studentPassword');
  
  sectionSelect.innerHTML = '<option value="">Select Section</option>';
  strandDiv.classList.add('hidden');
  
  // Clear password when grade changes
  if (passwordInput) {
    passwordInput.value = '';
    passwordInput.placeholder = 'Password will auto-fill when you select a section';
  }
  
  if (!gradeLevel) {
    sectionDiv.classList.add('hidden');
    return;
  }
  
  sectionDiv.classList.remove('hidden');
  
  if (sectionData[gradeLevel]) {
    if (gradeLevel === 'Grade 11' || gradeLevel === 'Grade 12') {
      // For senior high, show all sections from all strands
      for (const strand in sectionData[gradeLevel].strands) {
        sectionData[gradeLevel].strands[strand].sections.forEach(section => {
          sectionSelect.innerHTML += `<option value="${section.name}" data-strand="${strand}" data-password="${section.defaultPassword}">${section.name} (${strand})</option>`;
        });
      }
    } else {
      // For junior high, show sections directly
      sectionData[gradeLevel].sections.forEach(section => {
        sectionSelect.innerHTML += `<option value="${section.name}" data-password="${section.defaultPassword}">${section.name}</option>`;
      });
    }
  }
}

// Update strand based on section selection
function updateStrand() {
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const sectionSelect = document.getElementById('studentSection');
  const selectedOption = sectionSelect.options[sectionSelect.selectedIndex];
  const sectionName = sectionSelect.value;
  const strandDiv = document.getElementById('strandDiv');
  const strandInput = document.getElementById('studentStrand');
  const passwordInput = document.getElementById('studentPassword');
  
  if (!sectionName) {
    // Clear password if no section selected
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.placeholder = 'Password will auto-fill when you select a section';
    }
    return;
  }
  
  if (gradeLevel === 'Grade 11' || gradeLevel === 'Grade 12') {
    const strand = selectedOption.getAttribute('data-strand');
    if (strand) {
      strandDiv.classList.remove('hidden');
      strandInput.value = strand;
    }
  } else {
    strandDiv.classList.add('hidden');
    strandInput.value = '';
  }
  
  // Auto-fill password based on section (user can still edit it)
  const defaultPassword = selectedOption.getAttribute('data-password');
  if (defaultPassword && passwordInput) {
    passwordInput.value = defaultPassword;
    passwordInput.placeholder = `Default: ${defaultPassword} (You can change this for privacy)`;
  }
}

// Student Registration Steps
function goToStep2() {
  // Validate step 1
  const lrn = document.getElementById('studentLRN').value;
  const lastName = document.getElementById('studentLastName').value;
  const firstName = document.getElementById('studentFirstName').value;
  const middleName = document.getElementById('studentMiddleName').value;
  const email = document.getElementById('studentEmail').value;
  const password = document.getElementById('studentPassword').value;
  const educationLevel = document.getElementById('studentEducationLevel').value;
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const section = document.getElementById('studentSection').value;
  const gender = document.getElementById('studentGender').value;
  
  if (!lrn || !lastName || !firstName || !middleName || !email || !password || !educationLevel || !gradeLevel || !section || !gender) {
    alert('Please fill in all required fields');
    return;
  }
  
  document.getElementById('studentStep1').classList.add('hidden');
  document.getElementById('studentStep2').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepIndicator').textContent = 'Step 2 of 4';
  document.getElementById('progress2').classList.remove('bg-lighter/30');
  document.getElementById('progress2').classList.add('bg-primary');
  document.getElementById('progress2').previousElementSibling.classList.remove('text-lighter/60');
  document.getElementById('progress2').previousElementSibling.classList.add('text-white');
}

function backToStep1() {
  document.getElementById('studentStep2').classList.add('hidden');
  document.getElementById('studentStep1').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepIndicator').textContent = 'Step 1 of 4';
  document.getElementById('progress2').classList.remove('bg-primary');
  document.getElementById('progress2').classList.add('bg-lighter/30');
  document.getElementById('progress2').previousElementSibling.classList.remove('text-white');
  document.getElementById('progress2').previousElementSibling.classList.add('text-lighter/60');
}

function goToStep3() {
  // Validate step 2
  const parentFullName = document.getElementById('parentFullName').value;
  const parentEmail = document.getElementById('parentEmail').value;
  const parentContact = document.getElementById('parentContact').value;
  const parentRelationship = document.getElementById('parentRelationship').value;
  const parentAddress = document.getElementById('parentAddress').value;
  const parentalConsent = document.getElementById('parentalConsent').checked;
  
  if (!parentFullName || !parentEmail || !parentContact || !parentRelationship || !parentAddress || !parentalConsent) {
    alert('Please fill in all required fields and provide parental consent');
    return;
  }
  
  // Show review
  const reviewContent = document.getElementById('reviewContent');
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const section = document.getElementById('studentSection').value;
  const strand = document.getElementById('studentStrand').value;
  
  reviewContent.innerHTML = `
    <div class="bg-white/5 p-4 rounded-lg">
      <h4 class="font-bold text-lg mb-3 text-lighter">Student Information</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <p><strong>LRN:</strong> ${document.getElementById('studentLRN').value}</p>
        <p><strong>Name:</strong> ${document.getElementById('studentLastName').value}, ${document.getElementById('studentFirstName').value} ${document.getElementById('studentMiddleName').value}</p>
        <p><strong>Grade:</strong> ${gradeLevel}</p>
        <p><strong>Section:</strong> ${section}</p>
        ${strand ? `<p><strong>Strand:</strong> ${strand}</p>` : ''}
        <p><strong>Gender:</strong> ${document.getElementById('studentGender').value}</p>
        <p class="col-span-2"><strong>Email:</strong> ${document.getElementById('studentEmail').value}</p>
      </div>
    </div>
    
    <div class="bg-white/5 p-4 rounded-lg">
      <h4 class="font-bold text-lg mb-3 text-lighter">Parent/Guardian Information</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <p><strong>Name:</strong> ${parentFullName}</p>
        <p><strong>Relationship:</strong> ${parentRelationship}</p>
        <p><strong>Contact:</strong> ${parentContact}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p class="col-span-2"><strong>Address:</strong> ${parentAddress}</p>
        <p class="col-span-2 text-green-400"><strong>Consent:</strong> ✓ Given</p>
      </div>
    </div>
  `;
  
  document.getElementById('studentStep2').classList.add('hidden');
  document.getElementById('studentStep3').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepIndicator').textContent = 'Step 3 of 4';
  document.getElementById('progress3').classList.remove('bg-lighter/30');
  document.getElementById('progress3').classList.add('bg-primary');
  document.getElementById('progress3').previousElementSibling.classList.remove('text-lighter/60');
  document.getElementById('progress3').previousElementSibling.classList.add('text-white');
}

function backToStep2() {
  document.getElementById('studentStep3').classList.add('hidden');
  document.getElementById('studentStep2').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepIndicator').textContent = 'Step 2 of 4';
  document.getElementById('progress3').classList.remove('bg-primary');
  document.getElementById('progress3').classList.add('bg-lighter/30');
  document.getElementById('progress3').previousElementSibling.classList.remove('text-white');
  document.getElementById('progress3').previousElementSibling.classList.add('text-lighter/60');
}

// Submit Student Registration
async function submitStudentRegistration() {
  try {
    const gradeLevel = document.getElementById('studentGradeLevel').value;
    const section = document.getElementById('studentSection').value;
    const strand = document.getElementById('studentStrand').value;
    const fullName = `${document.getElementById('studentLastName').value}, ${document.getElementById('studentFirstName').value} ${document.getElementById('studentMiddleName').value}`;
    
    // Get section pin
    let sectionPin = '';
    if (gradeLevel === 'Grade 11' || gradeLevel === 'Grade 12') {
      sectionPin = sectionData[gradeLevel].strands[strand].pins[section];
    } else {
      sectionPin = sectionData[gradeLevel].pins[section];
    }
    
    // Step 1: Create user account
    const userResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('studentEmail').value,
        password: document.getElementById('studentPassword').value,
        role: 'student'
      })
    });
    
    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      alert(userData.message);
      return;
    }
    
    // Step 2: Complete student profile
    const studentResponse = await fetch(`${API_URL}/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userData.userId,
        lrn: document.getElementById('studentLRN').value,
        fullName: fullName,
        gradeLevel,
        section,
        sectionPin,
        strand,
        gender: document.getElementById('studentGender').value,
        email: document.getElementById('studentEmail').value,
        parentGuardian: {
          fullName: document.getElementById('parentFullName').value,
          email: document.getElementById('parentEmail').value,
          contactNumber: document.getElementById('parentContact').value,
          relationship: document.getElementById('parentRelationship').value,
          homeAddress: document.getElementById('parentAddress').value,
          parentalConsent: document.getElementById('parentalConsent').checked
        }
      })
    });
    
    const studentData = await studentResponse.json();
    
    if (!studentResponse.ok) {
      alert(studentData.message);
      return;
    }
    
    // Save token
    localStorage.setItem('token', userData.token);
    currentUser = { id: userData.userId, role: 'student' };
    currentProfile = studentData.student;
    
    // Show completion step
    document.getElementById('studentStep3').classList.add('hidden');
    document.getElementById('studentStep4').classList.remove('hidden');
    
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}

// Submit Teacher Registration
async function submitTeacherRegistration() {
  try {
    const fullName = document.getElementById('teacherFullName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    const advisorySection = document.getElementById('teacherAdvisory').value;
    const office = document.getElementById('teacherOffice').value;
    
    if (!fullName || !email || !password || !office) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Step 1: Create user account
    const userResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role: 'teacher'
      })
    });
    
    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      alert(userData.message);
      return;
    }
    
    // Step 2: Complete teacher profile
    const teacherResponse = await fetch(`${API_URL}/auth/register/teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userData.userId,
        fullName,
        advisorySection,
        office
      })
    });
    
    const teacherData = await teacherResponse.json();
    
    if (!teacherResponse.ok) {
      alert(teacherData.message);
      return;
    }
    
    // Save token
    localStorage.setItem('token', userData.token);
    currentUser = { id: userData.userId, role: userData.role };
    currentProfile = teacherData.teacher;
    
    alert('Registration successful!');
    hideRegister();
    viewProfile();
    
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  try {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      alert(data.message);
      return;
    }
    
    // Save token and user data
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    currentProfile = data.profile;
    
    hideLogin();
    viewProfile();
    
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

// View Profile
function viewProfile() {
  if (!currentUser || !currentProfile) {
    alert('Please log in first');
    return;
  }
  
  // Hide home page and modals
  document.getElementById('homePage').classList.add('hidden');
  hideLogin();
  hideRegister();
  
  // Load appropriate profile page
  if (currentUser.role === 'student') {
    window.location.href = 'student-dashboard.html';
  } else if (currentUser.role === 'teacher' || currentUser.role === 'sao') {
    window.location.href = 'teacher-dashboard.html';
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  currentProfile = null;
  location.reload();
}


// ============================================
// NEW REGISTRATION FUNCTIONS FOR NEW DESIGN
// ============================================

// Update sections based on grade level (new design)
function updateSectionsNew() {
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const sectionSelect = document.getElementById('studentSection');
  const strandDiv = document.getElementById('strandDivNew');
  
  sectionSelect.innerHTML = '<option value="">Select Section</option>';
  sectionSelect.disabled = !gradeLevel;
  strandDiv.classList.add('hidden');
  
  if (!gradeLevel || !sectionData[gradeLevel]) return;
  
  if (gradeLevel === 'Grade 11' || gradeLevel === 'Grade 12') {
    // For senior high, show all sections from all strands
    for (const strand in sectionData[gradeLevel].strands) {
      sectionData[gradeLevel].strands[strand].sections.forEach(section => {
        sectionSelect.innerHTML += `<option value="${section}" data-strand="${strand}">${section} (${strand})</option>`;
      });
    }
  } else {
    // For junior high, show sections directly
    sectionData[gradeLevel].sections.forEach(section => {
      sectionSelect.innerHTML += `<option value="${section}">${section}</option>`;
    });
  }
}

// Update strand based on section selection (new design)
function updateStrandNew() {
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const sectionSelect = document.getElementById('studentSection');
  const selectedOption = sectionSelect.options[sectionSelect.selectedIndex];
  const strandDiv = document.getElementById('strandDivNew');
  const strandInput = document.getElementById('studentStrandNew');
  
  if (gradeLevel === 'Grade 11' || gradeLevel === 'Grade 12') {
    const strand = selectedOption.getAttribute('data-strand');
    if (strand) {
      strandDiv.classList.remove('hidden');
      strandInput.value = strand;
    }
  } else {
    strandDiv.classList.add('hidden');
    strandInput.value = '';
  }
}

// Go to Step 2 (new design)
function goToStep2New() {
  // Validate step 1
  const lrn = document.getElementById('studentLRN').value;
  const lastName = document.getElementById('studentLastName').value;
  const firstName = document.getElementById('studentFirstName').value;
  const middleName = document.getElementById('studentMiddleName').value;
  const email = document.getElementById('studentEmail').value;
  const password = document.getElementById('studentPassword').value;
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const section = document.getElementById('studentSection').value;
  const gender = document.getElementById('studentGender').value;
  
  if (!lrn || !lastName || !firstName || !middleName || !email || !password || !gradeLevel || !section || !gender) {
    alert('Please fill in all required fields');
    return;
  }
  
  document.getElementById('studentStep1').classList.add('hidden');
  document.getElementById('studentStep2').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepText').textContent = 'Step 2 of 4';
  document.getElementById('progress2').classList.remove('bg-accent/30');
  document.getElementById('progress2').classList.add('bg-primary');
  document.getElementById('label2').classList.add('font-semibold');
}

// Back to Step 1 (new design)
function backToStep1New() {
  document.getElementById('studentStep2').classList.add('hidden');
  document.getElementById('studentStep1').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepText').textContent = 'Step 1 of 4';
  document.getElementById('progress2').classList.remove('bg-primary');
  document.getElementById('progress2').classList.add('bg-accent/30');
  document.getElementById('label2').classList.remove('font-semibold');
}

// Go to Step 3 (new design)
function goToStep3New() {
  // Validate step 2
  const parentFullName = document.getElementById('parentFullName').value;
  const parentEmail = document.getElementById('parentEmail').value;
  const parentContact = document.getElementById('parentContact').value;
  const parentRelationship = document.getElementById('parentRelationship').value;
  const parentAddress = document.getElementById('parentAddress').value;
  const parentalConsent = document.getElementById('parentalConsent').checked;
  
  if (!parentFullName || !parentEmail || !parentContact || !parentRelationship || !parentAddress || !parentalConsent) {
    alert('Please fill in all required fields and provide parental consent');
    return;
  }
  
  // Show review
  const reviewContent = document.getElementById('reviewContent');
  const gradeLevel = document.getElementById('studentGradeLevel').value;
  const section = document.getElementById('studentSection').value;
  const strandInput = document.getElementById('studentStrandNew');
  const strand = strandInput ? strandInput.value : '';
  
  reviewContent.innerHTML = `
    <div class="bg-accent/10 p-4 rounded-lg">
      <h4 class="font-bold text-lg mb-3">Student Information</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <p><strong>LRN:</strong> ${document.getElementById('studentLRN').value}</p>
        <p><strong>Name:</strong> ${document.getElementById('studentLastName').value}, ${document.getElementById('studentFirstName').value} ${document.getElementById('studentMiddleName').value}</p>
        <p><strong>Grade:</strong> ${gradeLevel}</p>
        <p><strong>Section:</strong> ${section}</p>
        ${strand ? `<p><strong>Strand:</strong> ${strand}</p>` : ''}
        <p><strong>Gender:</strong> ${document.getElementById('studentGender').value}</p>
        <p class="col-span-2"><strong>Email:</strong> ${document.getElementById('studentEmail').value}</p>
      </div>
    </div>
    
    <div class="bg-accent/10 p-4 rounded-lg">
      <h4 class="font-bold text-lg mb-3">Parent/Guardian Information</h4>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <p><strong>Name:</strong> ${parentFullName}</p>
        <p><strong>Relationship:</strong> ${parentRelationship}</p>
        <p><strong>Contact:</strong> ${parentContact}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p class="col-span-2"><strong>Address:</strong> ${parentAddress}</p>
        <p class="col-span-2 text-green-600"><strong>Consent:</strong> ✓ Given</p>
      </div>
    </div>
  `;
  
  document.getElementById('studentStep2').classList.add('hidden');
  document.getElementById('studentStep3').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepText').textContent = 'Step 3 of 4';
  document.getElementById('progress3').classList.remove('bg-accent/30');
  document.getElementById('progress3').classList.add('bg-primary');
  document.getElementById('label3').classList.add('font-semibold');
}

// Back to Step 2 (new design)
function backToStep2New() {
  document.getElementById('studentStep3').classList.add('hidden');
  document.getElementById('studentStep2').classList.remove('hidden');
  
  // Update progress
  document.getElementById('stepText').textContent = 'Step 2 of 4';
  document.getElementById('progress3').classList.remove('bg-primary');
  document.getElementById('progress3').classList.add('bg-accent/30');
  document.getElementById('label3').classList.remove('font-semibold');
}

