// ============================================
// SYSTEM CONSTANTS - Shared across all dashboards
// ============================================

// Violation Types with Descriptions
const VIOLATION_TYPES = [
  {
    name: 'Academic Dishonesty',
    description: 'Cheating, plagiarism, or unauthorized collaboration',
    severity: 'high',
    color: '#dc2626'
  },
  {
    name: 'Behavioral Misconduct',
    description: 'Defiance, disrespect to staff, profanity, or disrupting the learning environment',
    severity: 'medium',
    color: '#f59e0b'
  },
  {
    name: 'Physical Violence & Aggression',
    description: 'Fighting, assault on students or staff, or intimidation',
    severity: 'critical',
    color: '#991b1b'
  },
  {
    name: 'Bullying & Harassment',
    description: 'Physical, psychological, or sexual harassment, including cyberbullying',
    severity: 'high',
    color: '#dc2626'
  },
  {
    name: 'Substance Use & Possession',
    description: 'Possession or usage of drugs, alcohol, or tobacco/vaping products',
    severity: 'critical',
    color: '#991b1b'
  },
  {
    name: 'Vandalism & Theft',
    description: 'Damaging school property or stealing personal property',
    severity: 'high',
    color: '#dc2626'
  },
  {
    name: 'Weapons Violation',
    description: 'Possession of firearms, knives, or other dangerous items',
    severity: 'critical',
    color: '#7f1d1d'
  },
  {
    name: 'Attendance Issues',
    description: 'Chronic absenteeism, truancy, skipping class, or tardiness',
    severity: 'low',
    color: '#f59e0b'
  },
  {
    name: 'Policy Violations',
    description: 'Violating dress codes, using prohibited technology, or gambling',
    severity: 'low',
    color: '#f59e0b'
  }
];

// Attendance Matter Types
const ATTENDANCE_MATTERS = [
  {
    code: '3x late',
    label: '3x Late',
    description: 'Student has been late 3 times',
    threshold: 3,
    type: 'late'
  },
  {
    code: '5x late',
    label: '5x Late',
    description: 'Student has been late 5 times',
    threshold: 5,
    type: 'late'
  },
  {
    code: '3x absent',
    label: '3x Absent',
    description: 'Student has been absent 3 times',
    threshold: 3,
    type: 'absent'
  }
];

// Attendance Status Types
const ATTENDANCE_STATUS = {
  PRESENT: { label: 'Present', color: 'green', icon: 'checkmark-circle' },
  ABSENT: { label: 'Absent', color: 'red', icon: 'close-circle' },
  LATE: { label: 'Late', color: 'yellow', icon: 'time' },
  EXCUSED: { label: 'Excused', color: 'blue', icon: 'document-text' }
};

// Appointment Types
const APPOINTMENT_TYPES = [
  { value: 'Violation', label: 'Violation', icon: 'warning', color: 'red' },
  { value: 'Attendance Matters', label: 'Attendance Matters', icon: 'calendar', color: 'orange' },
  { value: 'Consultation', label: 'Consultation', icon: 'chatbubbles', color: 'blue' },
  { value: 'Document Request', label: 'Document Request', icon: 'document', color: 'green' },
  { value: 'Guidance', label: 'Guidance Counseling', icon: 'heart', color: 'purple' },
  { value: 'Other', label: 'Other', icon: 'help-circle', color: 'gray' }
];

// Appointment Status
const APPOINTMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'yellow', icon: 'time' },
  CONFIRMED: { label: 'Confirmed', color: 'green', icon: 'checkmark-circle' },
  COMPLETED: { label: 'Completed', color: 'blue', icon: 'checkmark-done' },
  CANCELLED: { label: 'Cancelled', color: 'red', icon: 'close-circle' }
};

// Excuse Slip Reasons
const EXCUSE_SLIP_REASONS = [
  { value: 'Sick', label: 'Sick', icon: 'medical' },
  { value: 'Medical Appointment', label: 'Medical Appointment', icon: 'fitness' },
  { value: 'Family Emergency', label: 'Family Emergency', icon: 'alert-circle' },
  { value: 'Personal Matter', label: 'Personal Matter', icon: 'person' },
  { value: 'Other', label: 'Other', icon: 'help-circle' }
];

// Document Status
const DOCUMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'yellow', icon: 'time' },
  APPROVED: { label: 'Approved', color: 'green', icon: 'checkmark-circle' },
  REJECTED: { label: 'Rejected', color: 'red', icon: 'close-circle' }
};

// Notification Types
const NOTIFICATION_TYPES = {
  APPOINTMENTS: { label: 'Appointments', icon: 'calendar', color: 'blue' },
  VIOLATIONS: { label: 'Violations', icon: 'warning', color: 'red' },
  ATTENDANCE: { label: 'Attendance', icon: 'time', color: 'orange' },
  DOCUMENTS: { label: 'Documents', icon: 'document-text', color: 'green' },
  GENERAL: { label: 'General', icon: 'information-circle', color: 'gray' }
};

// Grade Levels
const GRADE_LEVELS = [
  { value: 7, label: 'Grade 7' },
  { value: 8, label: 'Grade 8' },
  { value: 9, label: 'Grade 9' },
  { value: 10, label: 'Grade 10' },
  { value: 11, label: 'Grade 11', hasStrands: true },
  { value: 12, label: 'Grade 12', hasStrands: true }
];

// Strands (for Grade 11 & 12)
const STRANDS = [
  { code: 'STEM', label: 'Science, Technology, Engineering, and Mathematics' },
  { code: 'HUMSS', label: 'Humanities and Social Sciences' },
  { code: 'ABM', label: 'Accountancy, Business, and Management' },
  { code: 'TVL', label: 'Technical-Vocational-Livelihood' }
];

// School Year
const CURRENT_SCHOOL_YEAR = '2025-2026';

// User Roles
const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  SAO: 'sao',
  PARENT: 'parent'
};

// Class Officer Positions
const OFFICER_POSITIONS = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'P.I.O. (Public Information Officer)',
  'Peace Officer',
  'Muse',
  'Escort'
];

// Subjects (Common for all grade levels)
const COMMON_SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Filipino',
  'Araling Panlipunan',
  'MAPEH',
  'TLE',
  'Values Education'
];

// Helper Functions
const HELPERS = {
  // Get violation by name
  getViolation: (name) => {
    return VIOLATION_TYPES.find(v => v.name === name);
  },
  
  // Get violation severity color
  getViolationColor: (name) => {
    const violation = VIOLATION_TYPES.find(v => v.name === name);
    return violation ? violation.color : '#6b7280';
  },
  
  // Get attendance status config
  getAttendanceStatus: (status) => {
    return ATTENDANCE_STATUS[status.toUpperCase()] || ATTENDANCE_STATUS.PRESENT;
  },
  
  // Get appointment status config
  getAppointmentStatus: (status) => {
    return APPOINTMENT_STATUS[status.toUpperCase()] || APPOINTMENT_STATUS.PENDING;
  },
  
  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // Format time
  formatTime: (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },
  
  // Get grade label
  getGradeLabel: (gradeLevel) => {
    const grade = GRADE_LEVELS.find(g => g.value === parseInt(gradeLevel));
    return grade ? grade.label : `Grade ${gradeLevel}`;
  },
  
  // Get strand label
  getStrandLabel: (code) => {
    const strand = STRANDS.find(s => s.code === code);
    return strand ? strand.label : code;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VIOLATION_TYPES,
    ATTENDANCE_MATTERS,
    ATTENDANCE_STATUS,
    APPOINTMENT_TYPES,
    APPOINTMENT_STATUS,
    EXCUSE_SLIP_REASONS,
    DOCUMENT_STATUS,
    NOTIFICATION_TYPES,
    GRADE_LEVELS,
    STRANDS,
    CURRENT_SCHOOL_YEAR,
    USER_ROLES,
    OFFICER_POSITIONS,
    COMMON_SUBJECTS,
    HELPERS
  };
}
