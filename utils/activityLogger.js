// ============================================
// ACTIVITY LOGGER UTILITY
// ============================================

const { query } = require('../config/database');

/**
 * Log user activity
 * @param {number} userId - User ID
 * @param {string} action - Action performed
 * @param {string} entityType - Type of entity (student, teacher, attendance, etc.)
 * @param {number} entityId - ID of the entity
 * @param {string} details - Additional details
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent string
 */
async function logActivity(userId, action, entityType, entityId, details, ipAddress, userAgent) {
  try {
    const sql = `INSERT INTO activity_logs 
      (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    await query(sql, [userId, action, entityType, entityId, details, ipAddress, userAgent]);
  } catch (error) {
    console.error('Activity logging error:', error);
    // Don't throw error - logging should not break the application
  }
}

/**
 * Get activity logs for a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of records to return
 */
async function getUserActivityLogs(userId, limit = 50) {
  const sql = `SELECT * FROM activity_logs 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?`;
  return await query(sql, [userId, limit]);
}

/**
 * Get recent activity logs
 * @param {number} limit - Number of records to return
 */
async function getRecentActivityLogs(limit = 100) {
  const sql = `SELECT al.*, u.email, u.role 
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC 
    LIMIT ?`;
  return await query(sql, [limit]);
}

/**
 * Get activity logs by action
 * @param {string} action - Action type
 * @param {number} limit - Number of records to return
 */
async function getActivityLogsByAction(action, limit = 50) {
  const sql = `SELECT al.*, u.email, u.role 
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.action = ?
    ORDER BY al.created_at DESC 
    LIMIT ?`;
  return await query(sql, [action, limit]);
}

/**
 * Get activity logs for date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 */
async function getActivityLogsByDateRange(startDate, endDate) {
  const sql = `SELECT al.*, u.email, u.role 
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE DATE(al.created_at) BETWEEN ? AND ?
    ORDER BY al.created_at DESC`;
  return await query(sql, [startDate, endDate]);
}

/**
 * Clean old activity logs (older than specified days)
 * @param {number} days - Number of days to keep
 */
async function cleanOldLogs(days = 90) {
  const sql = `DELETE FROM activity_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`;
  const result = await query(sql, [days]);
  return result.affectedRows;
}

module.exports = {
  logActivity,
  getUserActivityLogs,
  getRecentActivityLogs,
  getActivityLogsByAction,
  getActivityLogsByDateRange,
  cleanOldLogs
};
