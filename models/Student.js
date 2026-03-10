// ============================================
// STUDENT MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lrn: {
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
  gradeLevel: {
    type: Number,
    required: true,
    min: 7,
    max: 12
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred', 'graduated'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Static methods for compatibility
studentSchema.statics.create = async function(studentData) {
  const student = new this(studentData);
  const savedStudent = await student.save();
  return savedStudent._id;
};

studentSchema.statics.findById = async function(id) {
  return this.findById(id)
    .populate('userId', '-password')
    .populate('sectionId')
    .populate('parentId');
};

studentSchema.statics.findByUserId = async function(userId) {
  return this.findOne({ userId })
    .populate('userId', '-password')
    .populate('sectionId')
    .populate('parentId');
};

studentSchema.statics.findByLRN = async function(lrn) {
  return this.findOne({ lrn })
    .populate('userId', '-password')
    .populate('sectionId')
    .populate('parentId');
};

studentSchema.statics.findBySection = async function(sectionId) {
  return this.find({ sectionId, status: 'active' })
    .populate('userId', '-password')
    .populate('sectionId')
    .sort({ lastName: 1, firstName: 1 });
};

studentSchema.statics.findByGradeLevel = async function(gradeLevel) {
  return this.find({ gradeLevel, status: 'active' })
    .populate('userId', '-password')
    .populate('sectionId')
    .sort({ lastName: 1, firstName: 1 });
};

studentSchema.statics.findAll = async function() {
  return this.find({ status: 'active' })
    .populate('userId', '-password')
    .populate('sectionId')
    .sort({ gradeLevel: 1, lastName: 1, firstName: 1 });
};

studentSchema.statics.update = async function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true })
    .populate('userId', '-password')
    .populate('sectionId')
    .populate('parentId');
};

studentSchema.statics.search = async function(searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    status: 'active',
    $or: [
      { firstName: regex },
      { lastName: regex },
      { lrn: regex }
    ]
  })
  .populate('userId', '-password')
  .populate('sectionId')
  .limit(20);
};

module.exports = mongoose.model('Student', studentSchema);