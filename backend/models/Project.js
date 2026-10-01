const mongoose = require('mongoose');

/**
 * Project Schema
 * Represents a job posting created by a Client for Freelancers to bid on.
 */
const ProjectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a client'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed project description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'Please provide at least one required skill'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A project must have at least one skill tag',
      },
    },
    budget: {
      min: {
        type: Number,
        required: [true, 'Please provide minimum budget'],
        min: [100, 'Minimum budget must be at least ₹100'],
      },
      max: {
        type: Number,
        required: [true, 'Please provide maximum budget'],
        validate: {
          validator: function (val) {
            return val >= this.budget.min;
          },
          message: 'Maximum budget must be greater than or equal to minimum budget',
        },
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a deadline date'],
    },
    experienceLevel: {
      type: String,
      enum: ['ENTRY', 'INTERMEDIATE', 'EXPERT'],
      default: 'INTERMEDIATE',
    },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN',
    },
    proposalsCount: {
      type: Number,
      default: 0,
    },
    hiredFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searching, filtering and sorting
ProjectSchema.index({ title: 'text', description: 'text', skills: 'text' });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ 'budget.min': 1, 'budget.max': 1 });
ProjectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);
