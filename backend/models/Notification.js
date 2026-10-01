const mongoose = require('mongoose');

/**
 * Notification Schema
 * In-app notifications for realtime/polled alerts regarding bids, contracts, milestones, and messages.
 */
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'PROPOSAL_RECEIVED',
        'PROPOSAL_ACCEPTED',
        'PAYMENT_RECEIVED',
        'NEW_MESSAGE',
        'CONTRACT_MILESTONE',
        'PROJECT_COMPLETED',
        'SYSTEM_ALERT',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
