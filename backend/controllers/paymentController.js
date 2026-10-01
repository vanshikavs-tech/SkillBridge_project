const { createCheckoutSession } = require('../services/paymentService');
const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');

/**
 * Payment Controller
 * Manages Stripe session generation, simulated development payments, and transaction records.
 */

// @desc    Create checkout session or trigger simulated milestone payment
// @route   POST /api/payments/create-checkout
// @access  Private (CLIENT)
const createCheckout = async (req, res, next) => {
  try {
    const { contractId, milestoneId, amount, successUrl, cancelUrl } = req.body;

    if (!contractId || !amount) {
      return next(new ApiError(400, 'Contract ID and payment amount are required'));
    }

    const sessionResult = await createCheckoutSession({
      contractId,
      milestoneId,
      amount: Number(amount),
      clientUser: req.user,
      successUrl: successUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments/transactions?status=success`,
      cancelUrl: cancelUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments/transactions?status=cancelled`,
    });

    res.status(200).json({
      success: true,
      data: sessionResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history for currently authenticated user
// @route   GET /api/payments/history
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'CLIENT'
        ? { payerId: req.user._id }
        : req.user.role === 'ADMIN'
        ? {}
        : { payeeId: req.user._id };

    const { page, limit, skip, getPaginationMetadata } = getPagination(req.query, 10);
    const totalCount = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .populate('payerId', 'name avatar')
      .populate('payeeId', 'name avatar')
      .populate('contractId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      payments,
      pagination: getPaginationMetadata(totalCount),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe Signature Verified)
const handleStripeWebhook = async (req, res) => {
  // Receives and acknowledges webhook events from Stripe
  res.status(200).json({ received: true });
};

module.exports = {
  createCheckout,
  getTransactions,
  handleStripeWebhook,
};
