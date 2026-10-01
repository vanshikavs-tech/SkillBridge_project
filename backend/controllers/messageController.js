const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const { createNotification } = require('../services/notificationService');

/**
 * Message Controller
 * Manages conversation list, message history retrieval, and fallback HTTP messaging.
 */

// @desc    Get all conversations for currently authenticated user
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar role title')
      .populate('projectId', 'title')
      .populate('lastMessageSender', 'name')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create a conversation between current user and a target participant
// @route   POST /api/conversations
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { targetUserId, projectId } = req.body;

    if (!targetUserId) {
      return next(new ApiError(400, 'Target user ID is required to start a chat'));
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, targetUserId] },
    }).populate('participants', 'name avatar role title');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, targetUserId],
        projectId: projectId || null,
        lastMessage: 'Conversation started',
        lastMessageSender: req.user._id,
        lastMessageAt: new Date(),
      });

      conversation = await Conversation.findById(conversation._id).populate(
        'participants',
        'name avatar role title'
      );
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages for a specific conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return next(new ApiError(404, 'Conversation not found'));
    }

    if (!conversation.participants.some((p) => p.equals(req.user._id))) {
      return next(new ApiError(403, 'Unauthorized to view this conversation'));
    }

    const messages = await Message.find({ conversationId: id })
      .populate('senderId', 'name avatar role')
      .populate('receiverId', 'name avatar role')
      .sort({ createdAt: 1 });

    // Mark messages directed to current user as read
    await Message.updateMany(
      { conversationId: id, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message via HTTP (fallback when Socket is reconnecting)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, message, attachments } = req.body;

    if (!conversationId || !receiverId || !message) {
      return next(new ApiError(400, 'Conversation ID, receiver ID, and message text are required'));
    }

    const newMsg = await Message.create({
      conversationId,
      senderId: req.user._id,
      receiverId,
      message,
      attachments: attachments || [],
      read: false,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageSender: req.user._id,
      lastMessageAt: new Date(),
    });

    const populatedMsg = await Message.findById(newMsg._id)
      .populate('senderId', 'name avatar role')
      .populate('receiverId', 'name avatar role');

    await createNotification({
      userId: receiverId,
      type: 'NEW_MESSAGE',
      title: 'New Message',
      message: `${req.user.name}: "${message.substring(0, 40)}"`,
      relatedId: conversationId,
    });

    res.status(201).json({
      success: true,
      message: populatedMsg,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
};
