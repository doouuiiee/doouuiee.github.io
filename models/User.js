// ============================================
// USER MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'sao', 'parent'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static methods for compatibility with existing code
userSchema.statics.create = async function(userData) {
  const user = new this(userData);
  const savedUser = await user.save();
  return savedUser._id;
};

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

userSchema.statics.findUserById = async function(id) {
  return this.findById(id).select('-password');
};

userSchema.statics.updateLastLogin = async function(id) {
  return this.findByIdAndUpdate(id, { lastLogin: new Date() });
};

userSchema.statics.updatePassword = async function(id, newPassword) {
  const user = await this.findById(id);
  user.password = newPassword;
  return user.save();
};

userSchema.statics.deactivate = async function(id) {
  return this.findByIdAndUpdate(id, { isActive: false });
};

userSchema.statics.findAll = async function() {
  return this.find({ isActive: true }).select('-password');
};

module.exports = mongoose.model('User', userSchema);