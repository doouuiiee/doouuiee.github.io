// ============================================
// SECTION MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  gradeLevel: {
    type: Number,
    required: true,
    min: 7,
    max: 12
  },
  sectionName: {
    type: String,
    required: true,
    trim: true
  },
  strand: {
    type: String,
    enum: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'N/A'],
    default: 'N/A'
  },
  schoolYear: {
    type: String,
    required: true,
    default: '2025-2026'
  },
  capacity: {
    type: Number,
    default: 40
  },
  room: {
    type: String,
    trim: true
  },
  schedule: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique grade-section combination
sectionSchema.index({ gradeLevel: 1, sectionName: 1, schoolYear: 1 }, { unique: true });

// Virtual for full section name
sectionSchema.virtual('fullName').get(function() {
  return `Grade ${this.gradeLevel} - ${this.sectionName}${this.strand !== 'N/A' ? ' (' + this.strand + ')' : ''}`;
});

// Static methods for compatibility with existing code
sectionSchema.statics.create = async function(sectionData) {
  const section = new this(sectionData);
  const savedSection = await section.save();
  return savedSection._id;
};

sectionSchema.statics.findById = async function(id) {
  return this.findById(id);
};

sectionSchema.statics.findByGradeAndName = async function(gradeLevel, sectionName) {
  return this.findOne({ 
    gradeLevel, 
    sectionName,
    isActive: true 
  });
};

sectionSchema.statics.findByName = async function(sectionName) {
  return this.findOne({ 
    sectionName,
    isActive: true 
  });
};

sectionSchema.statics.findByGradeLevel = async function(gradeLevel) {
  return this.find({ 
    gradeLevel,
    isActive: true 
  }).sort({ sectionName: 1 });
};

sectionSchema.statics.getAll = async function() {
  return this.find({ isActive: true })
    .sort({ gradeLevel: 1, sectionName: 1 });
};

sectionSchema.statics.update = async function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

sectionSchema.statics.getStudentCount = async function(sectionId) {
  const Student = mongoose.model('Student');
  return Student.countDocuments({ 
    sectionId,
    status: 'active'
  });
};

sectionSchema.statics.getStudents = async function(sectionId) {
  const Student = mongoose.model('Student');
  return Student.find({ 
    sectionId,
    status: 'active'
  })
  .populate('userId', '-password')
  .populate('parentId')
  .sort({ lastName: 1, firstName: 1 });
};

sectionSchema.statics.deactivate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: false });
};

sectionSchema.statics.activate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: true });
};

module.exports = mongoose.model('Section', sectionSchema);
