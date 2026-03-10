// ============================================
// NOTIFICATION MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'announcement'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['attendance', 'violation', 'appointment', 'document', 'general', 'system'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  link: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Static methods for compatibility with existing code
notificationSchema.statics.create = async function(notificationData) {
  const notification = new this(notificationData);
  const savedNotification = await notification.save();
  return savedNotification._id;
};

notificationSchema.statics.findById = async function(id) {
  return this.findById(id).populate('userId', '-password');
};

notificationSchema.statics.findByUserId = async function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', '-password');
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.getUnread = async function(userId) {
  return this.find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .populate('userId', '-password');
};

notificationSchema.statics.markAsRead = async function(id) {
  return this.findByIdAndUpdate(
    id, 
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.deleteById = async function(id) {
  return this.findByIdAndDelete(id);
};

notificationSchema.statics.deleteOld = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate }
  });
};

notificationSchema.statics.sendToUser = async function(userId, title, message, type = 'info', priority = 'medium', category = 'general', link = null) {
  return this.create({
    userId,
    title,
    message,
    type,
    priority,
    category,
    link
  });
};

notificationSchema.statics.sendToMultiple = async function(userIds, title, message, type = 'info', priority = 'medium', category = 'general') {
  const notifications = userIds.map(userId => ({
    userId,
    title,
    message,
    type,
    priority,
    category
  }));
  
  return this.insertMany(notifications);
};

notificationSchema.statics.getByCategory = async function(userId, category) {
  return this.find({ userId, category })
    .sort({ createdAt: -1 })
    .populate('userId', '-password');
};

notificationSchema.statics.getByPriority = async function(userId, priority) {
  return this.find({ userId, priority })
    .sort({ createdAt: -1 })
    .populate('userId', '-password');
};

module.exports = mongoose.model('Notification', notificationSchema);
