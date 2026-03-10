// ============================================
// ACCESS CONTROL MIDDLEWARE
// ============================================

const { logActivity } = require('../utils/activityLogger');

// Permission definitions
const PERMISSIONS = {
  // Student permissions
  STUDENT: {
    VIEW_OWN_PROFILE: 'view_own_profile',
    EDIT_OWN_PROFILE: 'edit_own_profile',
    VIEW_OWN_ATTENDANCE: 'view_own_attendance',
    SUBMIT_EXCUSE_SLIP: 'submit_excuse_slip',
    BOOK_APPOINTMENT: 'book_appointment',
    VIEW_OWN_GRADES: 'view_own_grades',
    VIEW_NOTIFICATIONS: 'view_notifications'
  },
  
  // Teacher permissions
  TEACHER: {
    VIEW_STUDENTS: 'view_students',
    MARK_ATTENDANCE: 'mark_attendance',
    VIEW_ATTENDANCE: 'view_attendance',
    MANAGE_GRADES: 'manage_grades',
    VIEW_ADVISORY_CLASS: 'view_advisory_class',
    ASSIGN_OFFICERS: 'assign_officers',
    MANAGE_APPOINTMENTS: 'manage_appointments',
    SEND_NOTIFICATIONS: 'send_notifications'
  },
  
  // SAO permissions
  SAO: {
    VIEW_ALL_STUDENTS: 'view_all_students',
    EDIT_STUDENT_RECORDS: 'edit_student_records',
    VIEW_ALL_ATTENDANCE: 'view_all_attendance',
    MANAGE_VIOLATIONS: 'manage_violations',
    APPROVE_EXCUSE_SLIPS: 'approve_excuse_slips',
    MANAGE_ALL_APPOINTMENTS: 'manage_all_appointments',
    SEND_BULK_NOTIFICATIONS: 'send_bulk_notifications',
    GENERATE_REPORTS: 'generate_reports',
    MANAGE_SECTIONS: 'manage_sections',
    VIEW_ANALYTICS: 'view_analytics'
  },
  
  // Parent permissions
  PARENT: {
    VIEW_CHILD_PROFILE: 'view_child_profile',
    VIEW_CHILD_ATTENDANCE: 'view_child_attendance',
    VIEW_CHILD_GRADES: 'view_child_grades',
    RECEIVE_NOTIFICATIONS: 'receive_notifications',
    SCHEDULE_MEETINGS: 'schedule_meetings'
  }
};

// Role-permission mapping
const ROLE_PERMISSIONS = {
  student: Object.values(PERMISSIONS.STUDENT),
  teacher: [
    ...Object.values(PERMISSIONS.TEACHER),
    PERMISSIONS.STUDENT.VIEW_OWN_PROFILE,
    PERMISSIONS.STUDENT.VIEW_NOTIFICATIONS
  ],
  sao: [
    ...Object.values(PERMISSIONS.SAO),
    ...Object.values(PERMISSIONS.TEACHER),
    ...Object.values(PERMISSIONS.STUDENT)
  ],
  parent: Object.values(PERMISSIONS.PARENT)
};

/**
 * Check if user has permission
 * @param {object} user - User object with role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Middleware to require specific permission
 * @param {string} permission - Required permission
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!hasPermission(req.user, permission)) {
      // Log unauthorized access attempt
      await logActivity(
        req.user.id,
        'unauthorized_access',
        null,
        null,
        `Attempted to access ${permission}`,
        req.ip,
        req.get('user-agent')
      );

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
}

/**
 * Middleware to require any of the specified permissions
 * @param {array} permissions - Array of permissions (user needs at least one)
 */
function requireAnyPermission(permissions) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const hasAnyPermission = permissions.some(permission => 
      hasPermission(req.user, permission)
    );

    if (!hasAnyPermission) {
      await logActivity(
        req.user.id,
        'unauthorized_access',
        null,
        null,
        `Attempted to access one of: ${permissions.join(', ')}`,
        req.ip,
        req.get('user-agent')
      );

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
}

/**
 * Middleware to check resource ownership
 * @param {string} resourceType - Type of resource (student, teacher, etc.)
 * @param {string} idParam - Request parameter containing resource ID
 */
function requireOwnership(resourceType, idParam = 'id') {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // SAO can access everything
    if (req.user.role === 'sao') {
      return next();
    }

    const resourceId = req.params[idParam] || req.body[idParam];

    // Check ownership based on resource type
    let isOwner = false;

    switch (resourceType) {
      case 'student':
        // Students can only access their own data
        if (req.user.role === 'student') {
          const Student = require('../models/Student');
          const student = await Student.findByUserId(req.user.id);
          isOwner = student && student.id == resourceId;
        }
        // Teachers can access their advisory students
        else if (req.user.role === 'teacher') {
          const Teacher = require('../models/Teacher');
          const teacher = await Teacher.findByUserId(req.user.id);
          const Student = require('../models/Student');
          const student = await Student.findById(resourceId);
          isOwner = student && student.section_id === teacher.advisory_section_id;
        }
        break;

      case 'teacher':
        // Teachers can only access their own data
        if (req.user.role === 'teacher') {
          const Teacher = require('../models/Teacher');
          const teacher = await Teacher.findByUserId(req.user.id);
          isOwner = teacher && teacher.id == resourceId;
        }
        break;

      case 'parent':
        // Parents can only access their own data
        if (req.user.role === 'parent') {
          const Parent = require('../models/Parent');
          const parent = await Parent.findByUserId(req.user.id);
          isOwner = parent && parent.id == resourceId;
        }
        break;

      default:
        isOwner = false;
    }

    if (!isOwner) {
      await logActivity(
        req.user.id,
        'unauthorized_access',
        resourceType,
        resourceId,
        `Attempted to access ${resourceType} ${resourceId}`,
        req.ip,
        req.get('user-agent')
      );

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
}

/**
 * Middleware to check if user can view student data
 */
function canViewStudent() {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const studentId = req.params.studentId || req.params.id;

    // SAO can view all students
    if (req.user.role === 'sao') {
      return next();
    }

    // Students can view their own data
    if (req.user.role === 'student') {
      const Student = require('../models/Student');
      const student = await Student.findByUserId(req.user.id);
      if (student && student.id == studentId) {
        return next();
      }
    }

    // Teachers can view their advisory students
    if (req.user.role === 'teacher') {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findByUserId(req.user.id);
      const Student = require('../models/Student');
      const student = await Student.findById(studentId);
      
      if (student && student.section_id === teacher.advisory_section_id) {
        return next();
      }
    }

    // Parents can view their children
    if (req.user.role === 'parent') {
      const Parent = require('../models/Parent');
      const parent = await Parent.findByUserId(req.user.id);
      const Student = require('../models/Student');
      const student = await Student.findById(studentId);
      
      if (student && student.parent_id === parent.id) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'You do not have permission to view this student'
    });
  };
}

/**
 * Middleware to restrict access to specific time windows
 * @param {object} timeWindow - { start: 'HH:MM', end: 'HH:MM' }
 */
function restrictToTimeWindow(timeWindow) {
  return (req, res, next) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (currentTime < timeWindow.start || currentTime > timeWindow.end) {
      return res.status(403).json({
        success: false,
        message: `This action is only available between ${timeWindow.start} and ${timeWindow.end}`
      });
    }

    next();
  };
}

/**
 * Middleware to restrict access to specific days
 * @param {array} allowedDays - Array of day numbers (0 = Sunday, 6 = Saturday)
 */
function restrictToDays(allowedDays) {
  return (req, res, next) => {
    const today = new Date().getDay();
    
    if (!allowedDays.includes(today)) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const allowedDayNames = allowedDays.map(d => dayNames[d]).join(', ');
      
      return res.status(403).json({
        success: false,
        message: `This action is only available on: ${allowedDayNames}`
      });
    }

    next();
  };
}

/**
 * Get user permissions
 * @param {object} user - User object
 * @returns {array} - Array of permissions
 */
function getUserPermissions(user) {
  if (!user || !user.role) return [];
  return ROLE_PERMISSIONS[user.role] || [];
}

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireOwnership,
  canViewStudent,
  restrictToTimeWindow,
  restrictToDays,
  getUserPermissions
};
