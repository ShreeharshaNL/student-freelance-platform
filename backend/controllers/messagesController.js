const { Conversation, Message } = require("../models/ChatModels");
const mongoose = require("mongoose");

// Utility to build a deterministic key for the two participants
const buildKey = (a, b) => {
  const aStr = a.toString();
  const bStr = b.toString();
  return aStr < bStr ? `${aStr}_${bStr}` : `${bStr}_${aStr}`;
};

// Create or get conversation with target user
exports.createOrGetConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('createOrGetConversation called', { userId, requester: req.user && req.user._id });
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    // Validate userId is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId provided to createOrGetConversation:', userId);
      return res.status(400).json({ success: false, error: "Invalid userId" });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: "Cannot create conversation with yourself" });
    }

    const key = buildKey(req.user._id, userId);

    let convo = await Conversation.findOne({ key })
      .populate({ path: "lastMessage", select: "content sender createdAt" });

    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user._id, new mongoose.Types.ObjectId(userId)],
        key,
      });
    }

    // Determine the other participant id
    const otherId = convo.participants.find((p) => p.toString() !== req.user._id.toString());

    res.json({
      success: true,
      data: {
        conversation: {
          _id: convo._id,
          participants: convo.participants,
          otherUserId: otherId,
          lastMessage: convo.lastMessage || null,
          updatedAt: convo.updatedAt,
        },
      },
    });
  } catch (err) {
    console.error("createOrGetConversation error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all conversations for current user
exports.getConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({ participants: req.user._id })
      .sort({ updatedAt: -1 })
      .populate({ path: "lastMessage", select: "content sender createdAt" })
      .populate({ path: "participants", select: "name email" })
      .lean();

    const result = convos.map((c) => {
      const otherId = c.participants.find((p) => p._id.toString() !== req.user._id.toString());
      return {
        _id: c._id,
        otherUserId: otherId?._id,
        otherUserName: otherId?.name,
        lastMessage: c.lastMessage || null,
        updatedAt: c.updatedAt,
      };
    });

    res.json({ success: true, data: { conversations: result } });
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get messages inside a conversation
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params; // conversation id

    const convo = await Conversation.findById(id);
    if (!convo) return res.status(404).json({ success: false, error: "Conversation not found" });
    const isParticipant = convo.participants.some((p) => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, error: "Not a participant" });

    const msgs = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .select("_id sender recipient content createdAt read")
      .lean();

    res.json({ success: true, data: { messages: msgs } });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params; // conversation id
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: "Message content is required" });
    }

    const convo = await Conversation.findById(id);
    if (!convo) return res.status(404).json({ success: false, error: "Conversation not found" });

    const isParticipant = convo.participants.some((p) => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, error: "Not a participant" });

    const recipientId = convo.participants.find((p) => p.toString() !== req.user._id.toString());

    const msg = await Message.create({
      conversation: convo._id,
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
    });

    // Update conversation lastMessage
    convo.lastMessage = msg._id;
    await convo.save();

    const io = req.app.get("io");
    if (io) {
      io.to(convo._id.toString()).emit("message:new", {
        _id: msg._id,
        conversation: convo._id,
        sender: msg.sender,
        recipient: msg.recipient,
        content: msg.content,
        createdAt: msg.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        message: {
          _id: msg._id,
          conversation: convo._id,
          sender: msg.sender,
          recipient: msg.recipient,
          content: msg.content,
          createdAt: msg.createdAt,
        },
      },
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
