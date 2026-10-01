const Notification = require('../models/Notification');

let ioInstance = null;

const setNotificationSocketIO = (io) => {
  ioInstance = io;
};

/**
 * Creates and delivers an in-app notification.
 * 
 * Concept:
 * Persists the event in MongoDB so it is retained across sessions,
 * and if the recipient user is connected to WebSockets, emits it immediately.
 */
const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
    });

    if (ioInstance) {
      ioInstance.to(`user_${userId}`).emit('notification_received', notification);
    }

    return notification;
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err.message);
    return null;
  }
};

module.exports = {
  setNotificationSocketIO,
  createNotification,
};
