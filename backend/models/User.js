const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * Supports three primary roles:
 * - CLIENT: Posts projects, reviews proposals, hires freelancers, funds milestones
 * - FREELANCER: Submits proposals, completes contracts, receives payments, manages portfolio
 * - ADMIN: Moderates platform, manages user suspensions, reviews dispute reports and analytics
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude password from query results by default for security
    },
    role: {
      type: String,
      enum: ['CLIENT', 'FREELANCER', 'ADMIN'],
      default: 'FREELANCER',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    title: {
      type: String,
      default: 'Professional Freelancer',
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    location: {
      type: String,
      default: 'Remote',
    },
    skills: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: [0, 'Hourly rate cannot be negative'],
    },
    experienceLevel: {
      type: String,
      enum: ['ENTRY', 'INTERMEDIATE', 'EXPERT'],
      default: 'INTERMEDIATE',
    },
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        projectUrl: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    completedProjectsCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Pre-Save Hook: Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method: Compare input password with stored hash
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance Method: Exclude password and sensitive internal fields from JSON output
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Text index for searching freelancers by name, skills, title, or bio
UserSchema.index({ name: 'text', title: 'text', skills: 'text', bio: 'text' });

module.exports = mongoose.model('User', UserSchema);
