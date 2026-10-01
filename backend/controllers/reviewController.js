const Review = require('../models/Review');
const Contract = require('../models/Contract');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Review Controller
 * Handles 1-5 star reviews, feedback, and automatic profile rating calculation.
 */

// @desc    Submit a review for a completed contract
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { contractId, rating, comment } = req.body;

    if (!contractId || !rating || !comment) {
      return next(new ApiError(400, 'Contract ID, rating, and feedback comment are required'));
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return next(new ApiError(404, 'Contract not found'));
    }

    // Determine reviewee
    let revieweeId;
    if (contract.clientId.equals(req.user._id)) {
      revieweeId = contract.freelancerId;
    } else if (contract.freelancerId.equals(req.user._id)) {
      revieweeId = contract.clientId;
    } else {
      return next(new ApiError(403, 'You are not a participant in this contract'));
    }

    // Prevent duplicate review
    const existing = await Review.findOne({
      contractId,
      reviewerId: req.user._id,
    });
    if (existing) {
      return next(new ApiError(400, 'You have already submitted a review for this contract'));
    }

    const review = await Review.create({
      contractId,
      reviewerId: req.user._id,
      revieweeId,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating for reviewee
    const allReviews = await Review.find({ revieweeId });
    const totalCount = allReviews.length;
    const avgRating =
      allReviews.reduce((sum, item) => sum + item.rating, 0) / totalCount;

    await User.findByIdAndUpdate(revieweeId, {
      rating: parseFloat(avgRating.toFixed(1)),
      totalReviews: totalCount,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/users/:id/reviews
// @access  Public
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.id })
      .populate('reviewerId', 'name avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
};
