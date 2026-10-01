const express = require('express');
const router = express.Router();
const {
  createCheckout,
  getTransactions,
  handleStripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout', protect, createCheckout);
router.get('/history', protect, getTransactions);
router.post('/webhook', handleStripeWebhook);

module.exports = router;
