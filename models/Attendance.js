// ============================================
// ATTENDANCE MODEL - MONGODB
// ============================================

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true
  },
  timeIn: {
    type: Date,
    default: null
  },
  timeOut: {
    type: Date,
    default: null
  },
  remarks: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  period: {
    type: Number,
    min: 1,
    max: 8
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ studentId: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });

// Static methods for compatibility
attendanceSchema.statics.create = async function(attendanceData) {
  const attendance = new this(attendanceData);
  const savedAttendance = await attendance.save();
  return savedAttendance._id;
};

attendanceSchema.statics.findByStudent = async function(studentId, limit = 30) {
  return this.find({ studentId })
    .populate('studentId')
    .populate('recordedBy', 'email role')
    .sort({ date: -1 })
    .limit(limit);
};

attendanceSchema.statics.findByDateRange = async function(startDate, endDate, gradeLevel = null, section = null) {
  let query = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  const pipeline = [
    { $match: query },
    {
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $lookup: {
        from: 'sections',
        localField: 'student.sectionId',
        foreignField: '_id',
        as: 'section'
      }
    },
    { $unwind: '$section' }
  ];

  if (gradeLevel) {
    pipeline.push({ $match: { 'student.gradeLevel': parseInt(gradeLevel) } });
  }

  if (section) {
    pipeline.push({ $match: { 'section.name': section } });
  }

  pipeline.push({ $sort: { date: -1 } });

  return this.aggregate(pipeline);
};

attendanceSchema.statics.findByDate = async function(date) {
  return this.find({ 
    date: {
      $gte: new Date(date + 'T00:00:00.000Z'),
      $lt: new Date(date + 'T23:59:59.999Z')
    }
  })
  .populate('studentId')
  .populate('recordedBy', 'email role')
  .sort({ 'studentId.lastName': 1 });
};

attendanceSchema.statics.getAttendanceStats = async function(studentId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];

  return this.aggregate(pipeline);
};

attendanceSchema.statics.getAbsenteesList = async function(date) {
  return this.find({ 
    date: {
      $gte: new Date(date + 'T00:00:00.000Z'),
      $lt: new Date(date + 'T23:59:59.999Z')
    },
    status: { $in: ['absent', 'late'] }
  })
  .populate('studentId')
  .sort({ 'studentId.gradeLevel': 1, 'studentId.lastName': 1 });
};

attendanceSchema.statics.markAttendance = async function(studentId, date, status, recordedBy, remarks = '') {
  const existingRecord = await this.findOne({ studentId, date });
  
  if (existingRecord) {
    existingRecord.status = status;
    existingRecord.remarks = remarks;
    existingRecord.recordedBy = recordedBy;
    if (status === 'present' && !existingRecord.timeIn) {
      existingRecord.timeIn = new Date();
    }
    return existingRecord.save();
  } else {
    const attendanceData = {
      studentId,
      date,
      status,
      recordedBy,
      remarks
    };
    
    if (status === 'present') {
      attendanceData.timeIn = new Date();
    }
    
    return this.create(attendanceData);
  }
};

module.exports = mongoose.model('Attendance', attendanceSchema);