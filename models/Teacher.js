// ============================================
// TEACHER MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  advisorySectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Static methods for compatibility with existing code
teacherSchema.statics.create = async function(teacherData) {
  const teacher = new this(teacherData);
  const savedTeacher = await teacher.save();
  return savedTeacher._id;
};

teacherSchema.statics.findById = async function(id) {
  return this.findById(id)
    .populate('userId', '-password')
    .populate('advisorySectionId');
};

teacherSchema.statics.findByUserId = async function(userId) {
  return this.findOne({ userId })
    .populate('userId', '-password')
    .populate('advisorySectionId');
};

teacherSchema.statics.findByEmployeeId = async function(employeeId) {
  return this.findOne({ employeeId })
    .populate('userId', '-password')
    .populate('advisorySectionId');
};

teacherSchema.statics.getAll = async function() {
  return this.find({ isActive: true })
    .populate('userId', '-password')
    .populate('advisorySectionId')
    .sort({ lastName: 1, firstName: 1 });
};

teacherSchema.statics.update = async function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true })
    .populate('userId', '-password')
    .populate('advisorySectionId');
};

teacherSchema.statics.updateProfilePicture = async function(id, picturePath) {
  return this.findByIdAndUpdate(id, { profilePicture: picturePath }, { new: true });
};

teacherSchema.statics.getSubjects = async function(teacherId) {
  // This would require a TeacherSubjects collection
  // For now, return empty array
  return [];
};

teacherSchema.statics.getAdvisoryStudents = async function(teacherId) {
  const teacher = await this.findById(teacherId);
  if (!teacher || !teacher.advisorySectionId) {
    return [];
  }
  
  const Student = mongoose.model('Student');
  return Student.find({ 
    sectionId: teacher.advisorySectionId,
    status: 'active'
  })
  .populate('userId', '-password')
  .populate('parentId')
  .sort({ lastName: 1, firstName: 1 });
};

teacherSchema.statics.deactivate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: false });
};

teacherSchema.statics.activate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: true });
};

module.exports = mongoose.model('Teacher', teacherSchema);
