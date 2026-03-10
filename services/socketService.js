// ============================================
// WEBSOCKET SERVICE - Real-time Notifications
// ============================================

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const connectedUsers = new Map(); // userId -> socketId

/**
 * Initialize Socket.IO
 * @param {object} server - HTTP server instance
 */
function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);
    
    // Join role-specific room
    socket.join(`role_${socket.userRole}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });

    // Handle custom events
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        const Notification = require('../models/Notification');
        await Notification.markAsRead(notificationId);
        socket.emit('notification_marked_read', { notificationId });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('user_typing', {
        userId: socket.userId,
        ...data
      });
    });
  });

  console.log('✓ Socket.IO initialized');
  return io;
}

/**
 * Send notification to specific user
 * @param {number} userId - User ID
 * @param {object} notification - Notification data
 */
function sendNotificationToUser(userId, notification) {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notification);
  }
}

/**
 * Send notification to multiple users
 * @param {array} userIds - Array of user IDs
 * @param {object} notification - Notification data
 */
function sendNotificationToUsers(userIds, notification) {
  if (io) {
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit('new_notification', notification);
    });
  }
}

/**
 * Send notification to all users with specific role
 * @param {string} role - User role (student, teacher, sao, parent)
 * @param {object} notification - Notification data
 */
function sendNotificationToRole(role, notification) {
  if (io) {
    io.to(`role_${role}`).emit('new_notification', notification);
  }
}

/**
 * Broadcast to all connected users
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
function broadcast(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

/**
 * Send appointment update
 * @param {number} userId - User ID
 * @param {object} appointment - Appointment data
 */
function sendAppointmentUpdate(userId, appointment) {
  if (io) {
    io.to(`user_${userId}`).emit('appointment_update', appointment);
  }
}

/**
 * Send attendance update
 * @param {number} userId - User ID
 * @param {object} attendance - Attendance data
 */
function sendAttendanceUpdate(userId, attendance) {
  if (io) {
    io.to(`user_${userId}`).emit('attendance_update', attendance);
  }
}

/**
 * Send violation alert
 * @param {number} userId - User ID
 * @param {object} violation - Violation data
 */
function sendViolationAlert(userId, violation) {
  if (io) {
    io.to(`user_${userId}`).emit('violation_alert', violation);
  }
}

/**
 * Check if user is online
 * @param {number} userId - User ID
 * @returns {boolean}
 */
function isUserOnline(userId) {
  return connectedUsers.has(userId);
}

/**
 * Get online users count
 * @returns {number}
 */
function getOnlineUsersCount() {
  return connectedUsers.size;
}

/**
 * Get all online users
 * @returns {array}
 */
function getOnlineUsers() {
  return Array.from(connectedUsers.keys());
}

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  sendNotificationToUsers,
  sendNotificationToRole,
  broadcast,
  sendAppointmentUpdate,
  sendAttendanceUpdate,
  sendViolationAlert,
  isUserOnline,
  getOnlineUsersCount,
  getOnlineUsers
};
