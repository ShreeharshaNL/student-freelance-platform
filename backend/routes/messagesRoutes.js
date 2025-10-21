const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/messagesController");

// Create or fetch existing one-to-one conversation with target user
router.post("/conversations", protect, createOrGetConversation);

// List my conversations
router.get("/conversations", protect, getConversations);

// List messages in a conversation
router.get("/conversations/:id/messages", protect, getMessages);

// Send a message in a conversation
router.post("/conversations/:id/messages", protect, sendMessage);

module.exports = router;
