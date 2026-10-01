const { stripeClient, isMockMode } = require('../config/stripe');
const Payment = require('../models/Payment');
const Contract = require('../models/Contract');
const User = require('../models/User');

/**
 * Payment Service
 * Handles Stripe Checkout Session creation and milestone releases.
 * When real Stripe keys are omitted, gracefully executes a test simulation mode.
 */

const createCheckoutSession = async ({
  contractId,
  milestoneId,
  amount,
  clientUser,
  successUrl,
  cancelUrl,
}) => {
  const contract = await Contract.findById(contractId).populate('projectId freelancerId');
  if (!contract) {
    throw new Error('Contract not found');
  }

  // If real Stripe is available
  if (!isMockMode && stripeClient) {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Milestone Payment: ${contract.projectId?.title || 'Contract Payment'}`,
              description: `Contract #${contract._id}`,
            },
            unit_amount: Math.round(amount * 100), // convert to paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: clientUser.email,
      client_reference_id: contractId.toString(),
      metadata: {
        contractId: contractId.toString(),
        milestoneId: milestoneId ? milestoneId.toString() : '',
        payerId: clientUser._id.toString(),
        payeeId: contract.freelancerId._id.toString(),
        amount: amount.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      mode: 'STRIPE',
      sessionId: session.id,
      url: session.url,
    };
  }

  // Fallback: Simulated Test Payment flow
  const paymentRecord = await Payment.create({
    contractId,
    milestoneId: milestoneId || null,
    payerId: clientUser._id,
    payeeId: contract.freelancerId._id,
    amount,
    currency: 'INR',
    paymentMethod: 'SIMULATED_TEST',
    status: 'SUCCEEDED',
    stripePaymentIntentId: `sim_pi_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    description: `Simulated checkout payment for milestone on contract #${contractId}`,
  });

  // Update Contract milestone status if milestoneId was provided
  if (milestoneId) {
    const milestone = contract.milestones.id(milestoneId);
    if (milestone) {
      milestone.status = 'PAID';
    }
  }

  contract.totalPaid = (contract.totalPaid || 0) + Number(amount);
  await contract.save();

  // Update user stats
  await User.findByIdAndUpdate(clientUser._id, { $inc: { totalSpent: Number(amount) } });
  await User.findByIdAndUpdate(contract.freelancerId._id, { $inc: { totalEarnings: Number(amount) } });

  return {
    mode: 'SIMULATED',
    payment: paymentRecord,
    url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments/transactions?status=success`,
  };
};

module.exports = {
  createCheckoutSession,
};
