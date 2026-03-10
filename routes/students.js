const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get student profile
router.get('/profile/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.update(req.params.id, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
