const mongoose = require('mongoose');

/**
 * Payment Schema
 * Records financial transactions, Stripe intents, and milestone releases.
 */
const PaymentSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Payment amount must be greater than zero'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['STRIPE', 'ESCROW_RELEASE', 'SIMULATED_TEST'],
      default: 'SIMULATED_TEST',
    },
    stripePaymentIntentId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    description: {
      type: String,
      default: 'Milestone payment release',
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ payerId: 1, createdAt: -1 });
PaymentSchema.index({ payeeId: 1, createdAt: -1 });
PaymentSchema.index({ contractId: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
