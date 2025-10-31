// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { sendChatMessage } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, sendChatMessage);

module.exports = router;