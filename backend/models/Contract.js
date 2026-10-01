const mongoose = require('mongoose');

/**
 * Milestone Sub-schema
 * Contracts break down project scope and payments into verifiable milestones.
 */
const MilestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Milestone amount is required'],
      min: [1, 'Milestone amount must be positive'],
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'PAID'],
      default: 'PENDING',
    },
    deliverables: [
      {
        notes: String,
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Contract Schema
 * Formed automatically when a Client accepts a Freelancer's proposal.
 */
const ContractSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
      default: 'ACTIVE',
    },
    milestones: [MilestoneSchema],
  },
  {
    timestamps: true,
  }
);

ContractSchema.index({ clientId: 1, status: 1 });
ContractSchema.index({ freelancerId: 1, status: 1 });

module.exports = mongoose.model('Contract', ContractSchema);
