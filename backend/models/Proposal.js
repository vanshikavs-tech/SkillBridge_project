const mongoose = require('mongoose');

/**
 * Proposal Schema
 * Represents a bid submitted by a Freelancer on a Client's Project.
 */
const ProposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Proposal must reference a project'],
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Proposal must reference a freelancer'],
    },
    coverLetter: {
      type: String,
      required: [true, 'Please provide a cover letter'],
      minlength: [30, 'Cover letter should be at least 30 characters'],
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    bidAmount: {
      type: Number,
      required: [true, 'Please provide a bid amount'],
      min: [50, 'Bid amount must be at least ₹50'],
    },
    estimatedDays: {
      type: Number,
      required: [true, 'Please provide estimated delivery time in days'],
      min: [1, 'Estimated days must be at least 1'],
    },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate proposals: a freelancer can only bid once per project
ProposalSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
