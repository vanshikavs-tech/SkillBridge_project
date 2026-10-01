const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Contract = require('../models/Contract');
const ApiError = require('../utils/ApiError');
const { createNotification } = require('../services/notificationService');

/**
 * Proposal Controller
 * Manages bidding lifecycle: submission, shortlisting, acceptance into contracts, rejection.
 */

// @desc    Submit proposal on a project
// @route   POST /api/projects/:projectId/proposals
// @access  Private (FREELANCER)
const submitProposal = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { coverLetter, bidAmount, estimatedDays, attachments } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    if (project.status !== 'OPEN') {
      return next(new ApiError(400, 'This project is no longer accepting proposals.'));
    }

    // Check if freelancer already applied
    const existingProposal = await Proposal.findOne({
      projectId,
      freelancerId: req.user._id,
    });
    if (existingProposal) {
      return next(new ApiError(400, 'You have already submitted a proposal for this project.'));
    }

    const proposal = await Proposal.create({
      projectId,
      freelancerId: req.user._id,
      coverLetter,
      bidAmount: Number(bidAmount),
      estimatedDays: Number(estimatedDays),
      attachments: attachments || [],
    });

    // Increment project proposals count
    await Project.findByIdAndUpdate(projectId, { $inc: { proposalsCount: 1 } });

    // Send in-app notification to the project owner (Client)
    await createNotification({
      userId: project.clientId,
      type: 'PROPOSAL_RECEIVED',
      title: 'New Bid Received',
      message: `${req.user.name} submitted a bid of ₹${bidAmount} on "${project.title}"`,
      relatedId: proposal._id,
    });

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      proposal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals for a specific project
// @route   GET /api/projects/:projectId/proposals
// @access  Private (CLIENT owner of project or ADMIN)
const getProjectProposals = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    if (!project.clientId.equals(req.user._id) && req.user.role !== 'ADMIN') {
      return next(new ApiError(403, 'Unauthorized to view proposals for this project'));
    }

    const proposals = await Proposal.find({ projectId })
      .populate('freelancerId', 'name avatar title skills rating totalReviews completedProjectsCount')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals submitted by current freelancer
// @route   GET /api/proposals/my-proposals
// @access  Private (FREELANCER)
const getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user._id })
      .populate('projectId', 'title category budget status deadline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      proposals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept proposal and automatically generate contract with milestones
// @route   POST /api/proposals/:id/accept
// @access  Private (CLIENT)
const acceptProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('projectId');
    if (!proposal) {
      return next(new ApiError(404, 'Proposal not found'));
    }

    const project = proposal.projectId;
    if (!project.clientId.equals(req.user._id)) {
      return next(new ApiError(403, 'Unauthorized to accept proposals for this project'));
    }

    if (proposal.status === 'ACCEPTED') {
      return next(new ApiError(400, 'This proposal has already been accepted'));
    }

    // 1. Mark proposal as ACCEPTED
    proposal.status = 'ACCEPTED';
    await proposal.save();

    // 2. Reject other proposals on this project
    await Proposal.updateMany(
      { projectId: project._id, _id: { $ne: proposal._id } },
      { status: 'REJECTED' }
    );

    // 3. Update project status to IN_PROGRESS
    project.status = 'IN_PROGRESS';
    project.hiredFreelancer = proposal.freelancerId;
    await project.save();

    // 4. Automatically generate a Contract with milestone breakdown
    // Breakdown total amount into 3 realistic milestones (e.g. 30%, 40%, 30%)
    const totalAmount = proposal.bidAmount;
    const m1Amount = Math.round(totalAmount * 0.3);
    const m2Amount = Math.round(totalAmount * 0.4);
    const m3Amount = totalAmount - m1Amount - m2Amount;

    const deadline = new Date(Date.now() + (proposal.estimatedDays || 14) * 24 * 60 * 60 * 1000);

    const contract = await Contract.create({
      projectId: project._id,
      clientId: req.user._id,
      freelancerId: proposal.freelancerId,
      proposalId: proposal._id,
      amount: totalAmount,
      totalPaid: 0,
      deadline,
      status: 'ACTIVE',
      milestones: [
        {
          title: 'Milestone 1: Architecture & UI Prototype',
          description: 'Initial design, project scaffold, and frontend mockups approval.',
          amount: m1Amount,
          status: 'IN_PROGRESS',
        },
        {
          title: 'Milestone 2: Core Feature Implementation',
          description: 'Frontend and backend feature integration, API endpoints, and primary workflow.',
          amount: m2Amount,
          status: 'PENDING',
        },
        {
          title: 'Milestone 3: Testing, Polishing & Final Delivery',
          description: 'Final deployment, bug fixes, documentation, and handover.',
          amount: m3Amount,
          status: 'PENDING',
        },
      ],
    });

    // 5. Notify Freelancer
    await createNotification({
      userId: proposal.freelancerId,
      type: 'PROPOSAL_ACCEPTED',
      title: 'Congratulations! You are Hired',
      message: `Your bid on "${project.title}" was accepted! A new contract has been created.`,
      relatedId: contract._id,
    });

    res.status(200).json({
      success: true,
      message: 'Proposal accepted and contract initialized successfully',
      contract,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a proposal
// @route   POST /api/proposals/:id/reject
// @access  Private (CLIENT)
const rejectProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('projectId');
    if (!proposal) {
      return next(new ApiError(404, 'Proposal not found'));
    }

    if (!proposal.projectId.clientId.equals(req.user._id)) {
      return next(new ApiError(403, 'Unauthorized to reject this proposal'));
    }

    proposal.status = 'REJECTED';
    await proposal.save();

    res.status(200).json({
      success: true,
      message: 'Proposal rejected',
      proposal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw proposal
// @route   DELETE /api/proposals/:id
// @access  Private (FREELANCER owner)
const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return next(new ApiError(404, 'Proposal not found'));
    }

    if (!proposal.freelancerId.equals(req.user._id)) {
      return next(new ApiError(403, 'Unauthorized to withdraw this proposal'));
    }

    if (proposal.status === 'ACCEPTED') {
      return next(new ApiError(400, 'Cannot withdraw an accepted contract proposal.'));
    }

    await Proposal.findByIdAndDelete(req.params.id);
    await Project.findByIdAndUpdate(proposal.projectId, { $inc: { proposalsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Proposal withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitProposal,
  getProjectProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal,
};
