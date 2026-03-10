// ============================================
// PARENT MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    enum: ['mother', 'father', 'guardian', 'other'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  homeAddress: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    trim: true
  },
  workAddress: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static methods for compatibility with existing code
parentSchema.statics.create = async function(parentData) {
  const parent = new this(parentData);
  const savedParent = await parent.save();
  return savedParent._id;
};

parentSchema.statics.findById = async function(id) {
  return this.findById(id);
};

parentSchema.statics.findByContactNumber = async function(contactNumber) {
  return this.findOne({ contactNumber });
};

parentSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

parentSchema.statics.getAll = async function() {
  return this.find({ isActive: true })
    .sort({ fullName: 1 });
};

parentSchema.statics.update = async function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

parentSchema.statics.getChildren = async function(parentId) {
  const Student = mongoose.model('Student');
  return Student.find({ parentId, status: 'active' })
    .populate('userId', '-password')
    .populate('sectionId')
    .sort({ lastName: 1, firstName: 1 });
};

parentSchema.statics.deactivate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: false });
};

parentSchema.statics.activate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: true });
};

module.exports = mongoose.model('Parent', parentSchema);
