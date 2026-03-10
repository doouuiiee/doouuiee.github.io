const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Record attendance
router.post('/', async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    const attendance = await Attendance.create({ studentId, date, status, remarks, recordedBy: req.body.recordedBy });
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get attendance by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.findByStudent(req.params.studentId);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get attendance by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate, gradeLevel, section } = req.query;
    const records = await Attendance.findByDateRange(startDate, endDate, gradeLevel, section);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
