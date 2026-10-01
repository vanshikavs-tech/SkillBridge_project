const mongoose = require('mongoose');

/**
 * Review Schema
 * Captures 1-to-5 star feedback and commentary between Clients and Freelancers
 * after a contract milestone or project completes.
 */
const ReviewSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide feedback commentary'],
      minlength: [5, 'Review comment must be at least 5 characters'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per reviewer per contract
ReviewSchema.index({ contractId: 1, reviewerId: 1 }, { unique: true });
ReviewSchema.index({ revieweeId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
