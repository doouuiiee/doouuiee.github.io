const express = require('express');
const router = express.Router();

// Upload file
router.post('/', async (req, res) => {
  try {
    // Simple upload response - implement proper upload later
    res.json({ success: true, message: 'Upload endpoint ready' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
