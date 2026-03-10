// ============================================
// EMAIL TEMPLATES - SAO E-Record System
// ============================================

const baseStyle = `
  font-family: 'Inter', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 20px;
`;

const headerStyle = `
  background: linear-gradient(135deg, #354024 0%, #4c3d19 100%);
  color: #e5d7c4;
  padding: 30px;
  text-align: center;
  border-radius: 10px 10px 0 0;
`;

const contentStyle = `
  background-color: white;
  padding: 30px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const buttonStyle = `
  display: inline-block;
  background-color: #354024;
  color: white;
  padding: 12px 30px;
  text-decoration: none;
  border-radius: 5px;
  margin: 20px 0;
  font-weight: 600;
`;

const footerStyle = `
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-top: 20px;
  padding: 20px;
`;

// 1. Registration Confirmation
function registrationConfirmation(name, role, lrn, gradeLevel, section) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin: 0;">Welcome to SAO E-Record System</h1>
        <p style="margin: 10px 0 0 0;">Cordova Catholic Cooperative School</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color: #354024;">Registration Successful!</h2>
        <p>Dear ${name},</p>
        <p>Your registration as a <strong>${role}</strong> has been successfully completed.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #354024;">Your Account Details:</h3>
          ${lrn ? `<p><strong>LRN:</strong> ${lrn}</p>` : ''}
          ${gradeLevel ? `<p><strong>Grade Level:</strong> ${gradeLevel}</p>` : ''}
          ${section ? `<p><strong>Section:</strong> ${section}</p>` : ''}
        </div>
        
        <p>You can now log in to the system using your credentials.</p>
        <a href="http://localhost:5000" style="${buttonStyle}">Login to Dashboard</a>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have any questions, please contact the SAO office.
        </p>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </div>
  `;
}

// 2. Appointment Confirmation
function appointmentConfirmation(name, date, time, purpose, type, matter) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin: 0;">Appointment Confirmed</h1>
        <p style="margin: 10px 0 0 0;">SAO Office</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color: #354024;">Your Appointment Has Been Confirmed</h2>
        <p>Dear ${name},</p>
        <p>Your appointment with the Student Affairs Office has been confirmed.</p>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-left: 4px solid #354024; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #354024;">Appointment Details:</h3>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          ${type ? `<p><strong>Type:</strong> ${type}</p>` : ''}
          ${matter ? `<p><strong>Matter:</strong> ${matter}</p>` : ''}
          ${purpose ? `<p><strong>Purpose:</strong> ${purpose}</p>` : ''}
        </div>
        
        <p><strong>Important Reminders:</strong></p>
        <ul>
          <li>Please arrive 5 minutes before your scheduled time</li>
          <li>Bring your student ID</li>
          <li>If you need to reschedule, contact the SAO office at least 24 hours in advance</li>
        </ul>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Location: SAO Office, 2nd Floor, Main Building
        </p>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>Contact: sao@cccs.edu | (032) XXX-XXXX</p>
      </div>
    </div>
  `;
}

// 3. Document Ready
function documentReady(name, documentType, pickupDate) {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin: 0;">Document Ready for Pickup</h1>
        <p style="margin: 10px 0 0 0;">SAO Office</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color: #354024;">Your Document is Ready!</h2>
        <p>Dear ${name},</p>
        <p>Good news! Your requested document is now ready for pickup.</p>
        
        <div style="background-color: #f0fff0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #354024;">Document Information:</h3>
          <p><strong>Document Type:</strong> ${documentType}</p>
          <p><strong>Available for Pickup:</strong> ${pickupDate}</p>
        </div>
        
        <p><strong>Pickup Instructions:</strong></p>
        <ul>
          <li>Visit the SAO Office during office hours (8:00 AM - 5:00 PM)</li>
          <li>Bring a valid ID for verification</li>
          <li>Documents not claimed within 30 days will be archived</li>
        </ul>
        
        <a href="http://localhost:5000/student-dashboard.html" style="${buttonStyle}">View Dashboard</a>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>Office Hours: Monday to Friday, 8:00 AM - 5:00 PM</p>
      </div>
    </div>
  `;
}

// 4. Violation Notice
function violationNotice(studentName, parentName, violationType, date, description, action) {
  return `
    <div style="${baseStyle}">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">Violation Notice</h1>
        <p style="margin: 10px 0 0 0;">Student Affairs Office</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color: #dc2626;">Student Violation Report</h2>
        <p>Dear ${parentName},</p>
        <p>We are writing to inform you about a violation committed by your child, <strong>${studentName}</strong>.</p>
        
        <div style="background-color: #fff5f5; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">Violation Details:</h3>
          <p><strong>Type:</strong> ${violationType}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Action Required:</strong> ${action}</p>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Please schedule a meeting with the SAO office</li>
          <li>Discuss the incident with your child</li>
          <li>Review school policies and regulations</li>
        </ul>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          We appreciate your cooperation in addressing this matter promptly.
        </p>
        
        <a href="http://localhost:5000" style="${buttonStyle}">Schedule Meeting</a>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>For concerns, contact: sao@cccs.edu | (032) XXX-XXXX</p>
      </div>
    </div>
  `;
}

// 5. Attendance Warning
function attendanceWarning(studentName, parentName, warningType, count, details) {
  return `
    <div style="${baseStyle}">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">Attendance Warning</h1>
        <p style="margin: 10px 0 0 0;">Student Affairs Office</p>
      </div>
      <div style="${contentStyle}">
        <h2 style="color: #f59e0b;">Attendance Alert</h2>
        <p>Dear ${parentName},</p>
        <p>We would like to bring to your attention the attendance record of your child, <strong>${studentName}</strong>.</p>
        
        <div style="background-color: #fffbeb; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #f59e0b;">Attendance Summary:</h3>
          <p><strong>Warning Type:</strong> ${warningType}</p>
          <p><strong>Count:</strong> ${count}</p>
          <p><strong>Details:</strong> ${details}</p>
        </div>
        
        <p><strong>School Policy Reminder:</strong></p>
        <ul>
          <li>Students with 3 consecutive absences require a parent conference</li>
          <li>Excessive tardiness affects academic performance</li>
          <li>Excuse slips must be submitted within 3 days</li>
        </ul>
        
        <p style="margin-top: 30px;">
          Please help us ensure your child's regular attendance. If there are any concerns, 
          we encourage you to reach out to the SAO office.
        </p>
        
        <a href="http://localhost:5000" style="${buttonStyle}">View Attendance Record</a>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>Working together for your child's success</p>
      </div>
    </div>
  `;
}

// 6. General Notification
function generalNotification(name, message, priority = 'normal') {
  const priorityColors = {
    high: { bg: '#dc2626', text: 'High Priority' },
    normal: { bg: '#354024', text: 'Normal' },
    low: { bg: '#6b7280', text: 'Low Priority' }
  };
  
  const priorityColor = priorityColors[priority] || priorityColors.normal;
  
  return `
    <div style="${baseStyle}">
      <div style="background: linear-gradient(135deg, ${priorityColor.bg} 0%, #1f2937 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">SAO Notification</h1>
        <p style="margin: 10px 0 0 0;">Cordova Catholic Cooperative School</p>
      </div>
      <div style="${contentStyle}">
        ${priority === 'high' ? '<div style="background-color: #fee2e2; color: #dc2626; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-weight: 600;">⚠️ High Priority Message</div>' : ''}
        
        <h2 style="color: #354024;">Hello, ${name}!</h2>
        <div style="line-height: 1.6; color: #333;">
          ${message}
        </div>
        
        <a href="http://localhost:5000" style="${buttonStyle}">Go to Dashboard</a>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If you have any questions, please contact the SAO office.
        </p>
      </div>
      <div style="${footerStyle}">
        <p>Cordova Catholic Cooperative School - Student Affairs Office</p>
        <p>Email: sao@cccs.edu | Phone: (032) XXX-XXXX</p>
      </div>
    </div>
  `;
}

module.exports = {
  registrationConfirmation,
  appointmentConfirmation,
  documentReady,
  violationNotice,
  attendanceWarning,
  generalNotification
};
