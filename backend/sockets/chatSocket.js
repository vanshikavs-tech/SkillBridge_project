const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { createNotification } = require('../services/notificationService');

/**
 * Socket.IO Real-Time Chat & Notification Server
 * 
 * Concept:
 * WebSockets provide full-duplex, persistent connections.
 * Unlike HTTP where the client polls the server, WebSockets allow
 * the server to instantly push new messages, typing indicators, and alerts.
 */
const onlineUsers = new Map(); // Map of userId -> Set(socketId)

const initChatSocket = (io) => {
  io.use((socket, next) => {
    // Authenticate socket handshake using JWT
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token required for Socket connection'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_dev_mode_change_in_prod'
      );
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      return next(new Error('Invalid token for Socket connection'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`[Socket.IO] 🔌 Client connected: ${userId} (socket ${socket.id})`);

    // Track online user sockets
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join user's private notification & direct room
    socket.join(`user_${userId}`);

    // Broadcast online status
    io.emit('user_status_change', { userId, status: 'ONLINE' });

    // Join a specific conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`[Socket.IO] User ${userId} joined room conversation_${conversationId}`);
    });

    // Leave a specific conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Send a message
    socket.on('send_message', async (data, callback) => {
      try {
        const { conversationId, receiverId, message, attachments } = data;

        const newMsg = await Message.create({
          conversationId,
          senderId: userId,
          receiverId,
          message,
          attachments: attachments || [],
          read: false,
        });

        const populatedMsg = await Message.findById(newMsg._id)
          .populate('senderId', 'name avatar role')
          .populate('receiverId', 'name avatar role');

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message,
          lastMessageSender: userId,
          lastMessageAt: new Date(),
        });

        // Broadcast to everyone in the conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', populatedMsg);

        // Also push notification to receiver's private room
        await createNotification({
          userId: receiverId,
          type: 'NEW_MESSAGE',
          title: 'New Message',
          message: `${populatedMsg.senderId.name}: "${message.length > 50 ? message.substring(0, 47) + '...' : message}"`,
          relatedId: conversationId,
        });

        if (callback) callback({ success: true, message: populatedMsg });
      } catch (err) {
        console.error('[Socket.IO] Error sending message:', err.message);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // Typing Indicators
    socket.on('typing_start', ({ conversationId, userName }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId,
        userName,
        isTyping: true,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId,
        isTyping: false,
      });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] ❌ Socket disconnected: ${socket.id} (user ${userId})`);
      if (onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit('user_status_change', { userId, status: 'OFFLINE' });
        }
      }
    });
  });
};

module.exports = { initChatSocket };
