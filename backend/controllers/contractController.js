const Contract = require('../models/Contract');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { createNotification } = require('../services/notificationService');

/**
 * Contract Controller
 * Manages active contracts, milestone delivery/approval flow, and final project sign-off.
 */

// @desc    Get contracts for currently authenticated user (Client or Freelancer)
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'CLIENT'
        ? { clientId: req.user._id }
        : req.user.role === 'ADMIN'
        ? {}
        : { freelancerId: req.user._id };

    const contracts = await Contract.find(filter)
      .populate('projectId', 'title category budget')
      .populate('clientId', 'name avatar')
      .populate('freelancerId', 'name avatar title rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contracts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contract by ID
// @route   GET /api/contracts/:id
// @access  Private
const getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('projectId')
      .populate('clientId', 'name avatar email location rating')
      .populate('freelancerId', 'name avatar email title rating completedProjectsCount');

    if (!contract) {
      return next(new ApiError(404, 'Contract not found'));
    }

    const isAuthorized =
      contract.clientId._id.equals(req.user._id) ||
      contract.freelancerId._id.equals(req.user._id) ||
      req.user.role === 'ADMIN';

    if (!isAuthorized) {
      return next(new ApiError(403, 'Unauthorized to view this contract'));
    }

    res.status(200).json({
      success: true,
      contract,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone status (submit work or approve)
// @route   PUT /api/contracts/:id/milestones/:milestoneId
// @access  Private
const updateMilestoneStatus = async (req, res, next) => {
  try {
    const { status, deliverableNotes, fileUrl } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return next(new ApiError(404, 'Contract not found'));
    }

    const milestone = contract.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return next(new ApiError(404, 'Milestone not found'));
    }

    const isClient = contract.clientId.equals(req.user._id);
    const isFreelancer = contract.freelancerId.equals(req.user._id);

    // Freelancer submitting work
    if (status === 'SUBMITTED') {
      if (!isFreelancer) {
        return next(new ApiError(403, 'Only the assigned freelancer can submit deliverables'));
      }
      milestone.status = 'SUBMITTED';
      milestone.deliverables.push({
        notes: deliverableNotes || 'Work delivered for review',
        fileUrl: fileUrl || '',
      });

      await createNotification({
        userId: contract.clientId,
        type: 'CONTRACT_MILESTONE',
        title: 'Milestone Deliverable Submitted',
        message: `Freelancer submitted work for milestone: "${milestone.title}". Please review.`,
        relatedId: contract._id,
      });
    }

    // Client approving milestone
    if (status === 'APPROVED' || status === 'PAID') {
      if (!isClient && req.user.role !== 'ADMIN') {
        return next(new ApiError(403, 'Only the client can approve or release milestone payments'));
      }
      milestone.status = status;

      await createNotification({
        userId: contract.freelancerId,
        type: 'CONTRACT_MILESTONE',
        title: 'Milestone Approved',
        message: `Client approved milestone: "${milestone.title}" (₹${milestone.amount})!`,
        relatedId: contract._id,
      });
    }

    if (status === 'IN_PROGRESS') {
      milestone.status = 'IN_PROGRESS';
    }

    await contract.save();

    res.status(200).json({
      success: true,
      message: `Milestone status updated to ${status}`,
      contract,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contract completely finished
// @route   POST /api/contracts/:id/complete
// @access  Private (CLIENT or ADMIN)
const completeContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return next(new ApiError(404, 'Contract not found'));
    }

    if (!contract.clientId.equals(req.user._id) && req.user.role !== 'ADMIN') {
      return next(new ApiError(403, 'Only the client or admin can close the contract'));
    }

    contract.status = 'COMPLETED';
    await contract.save();

    // Mark project as completed
    await Project.findByIdAndUpdate(contract.projectId, { status: 'COMPLETED' });

    // Increment freelancer completed count
    await User.findByIdAndUpdate(contract.freelancerId, {
      $inc: { completedProjectsCount: 1 },
    });

    // Notify both parties
    await createNotification({
      userId: contract.freelancerId,
      type: 'PROJECT_COMPLETED',
      title: 'Project Completed Successfully!',
      message: 'The contract has been concluded. Please leave a client review.',
      relatedId: contract._id,
    });

    res.status(200).json({
      success: true,
      message: 'Contract successfully marked as completed',
      contract,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContracts,
  getContractById,
  updateMilestoneStatus,
  completeContract,
};
