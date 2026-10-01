const User = require('../models/User');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');

/**
 * User Controller
 * Manages user profile updates, portfolio items, and freelancer directory browsing.
 */

// @desc    Get public profile of a user by ID
// @route   GET /api/users/:id
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Fetch user reviews
    const reviews = await Review.find({ revieweeId: user._id })
      .populate('reviewerId', 'name avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current authenticated user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'title',
      'bio',
      'location',
      'avatar',
      'skills',
      'hourlyRate',
      'experienceLevel',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search and browse freelancers with filters
// @route   GET /api/users/freelancers
// @access  Public
const getFreelancers = async (req, res, next) => {
  try {
    const { search, skill, minRate, maxRate, minRating, experience } = req.query;
    const filter = { role: 'FREELANCER', isSuspended: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (experience) {
      filter.experienceLevel = experience;
    }

    const { page, limit, skip, getPaginationMetadata } = getPagination(req.query, 12);
    const totalCount = await User.countDocuments(filter);

    const freelancers = await User.find(filter)
      .sort({ rating: -1, completedProjectsCount: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      freelancers,
      pagination: getPaginationMetadata(totalCount),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a portfolio item to freelancer profile
// @route   POST /api/users/portfolio
// @access  Private (FREELANCER)
const addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, projectUrl, imageUrl } = req.body;
    if (!title) {
      return next(new ApiError(400, 'Portfolio title is required'));
    }

    const user = await User.findById(req.user._id);
    user.portfolio.unshift({
      title,
      description,
      projectUrl,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Portfolio item added',
      portfolio: user.portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a portfolio item
// @route   DELETE /api/users/portfolio/:itemId
// @access  Private (FREELANCER)
const deletePortfolioItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.portfolio = user.portfolio.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted',
      portfolio: user.portfolio,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getFreelancers,
  addPortfolioItem,
  deletePortfolioItem,
};
