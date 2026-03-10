const express = require('express');
const router = express.Router();

// Get notifications for user
router.get('/', async (req, res) => {
  try {
    // Return empty array for now - implement proper model later
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    res.json({ success: true, message: 'Notification created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
