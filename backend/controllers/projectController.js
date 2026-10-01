const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');
const {
  getRecommendedProjectsForFreelancer,
  getRecommendedFreelancersForProject,
  calculateCompatibilityScore,
} = require('../services/recommendationService');

/**
 * Project Controller
 * Handles project creation, search, discovery, and client project management.
 */

// @desc    Create a new project posting
// @route   POST /api/projects
// @access  Private (CLIENT)
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      skills,
      budget,
      deadline,
      experienceLevel,
      attachments,
    } = req.body;

    if (!title || !description || !category || !budget) {
      return next(new ApiError(400, 'Title, description, category, and budget are required.'));
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      clientId: req.user._id,
      title,
      description,
      category,
      skills: skillsArray,
      budget: {
        min: Number(budget.min || budget),
        max: Number(budget.max || budget),
      },
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days
      experienceLevel: experienceLevel || 'INTERMEDIATE',
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Browse & search projects with filters, sorting, and pagination
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const {
      search,
      category,
      experience,
      minBudget,
      maxBudget,
      skill,
      status,
      sort,
    } = req.query;

    const filter = { status: status || 'OPEN' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (experience) {
      filter.experienceLevel = experience;
    }

    if (skill) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minBudget || maxBudget) {
      filter['budget.min'] = {};
      if (minBudget) filter['budget.min'].$gte = Number(minBudget);
      if (maxBudget) filter['budget.max'] = { $lte: Number(maxBudget) };
    }

    // Determine sorting order
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'budget_high') sortOption = { 'budget.max': -1 };
    if (sort === 'budget_low') sortOption = { 'budget.min': 1 };
    if (sort === 'proposals') sortOption = { proposalsCount: -1 };

    const { page, limit, skip, getPaginationMetadata } = getPagination(req.query, 10);
    const totalCount = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate('clientId', 'name avatar location rating')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      projects,
      pagination: getPaginationMetadata(totalCount),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project details by ID with recommendations
// @route   GET /api/projects/:id
// @access  Public (Optionally Authenticated)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name avatar location rating totalReviews totalSpent createdAt')
      .populate('hiredFreelancer', 'name avatar title skills rating');

    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    let matchScore = null;
    let recommendedFreelancers = [];

    // If current authenticated user is a freelancer, calculate their match score
    if (req.user && req.user.role === 'FREELANCER') {
      matchScore = calculateCompatibilityScore(req.user, project);
    }

    // If current user is the client who owns the project, fetch top recommended talent
    if (req.user && project.clientId._id.equals(req.user._id)) {
      recommendedFreelancers = await getRecommendedFreelancersForProject(project._id, 4);
    }

    res.status(200).json({
      success: true,
      project,
      matchScore,
      recommendedFreelancers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project posting
// @route   PUT /api/projects/:id
// @access  Private (CLIENT owner)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    if (!project.clientId.equals(req.user._id) && req.user.role !== 'ADMIN') {
      return next(new ApiError(403, 'Unauthorized to update this project'));
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel project posting
// @route   DELETE /api/projects/:id
// @access  Private (CLIENT owner or ADMIN)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    if (!project.clientId.equals(req.user._id) && req.user.role !== 'ADMIN') {
      return next(new ApiError(403, 'Unauthorized to delete this project'));
    }

    await Project.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ projectId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Project and associated proposals removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects posted by the authenticated client
// @route   GET /api/projects/client/my-projects
// @access  Private (CLIENT)
const getClientProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ clientId: req.user._id })
      .populate('hiredFreelancer', 'name avatar title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI recommended projects for the authenticated freelancer
// @route   GET /api/projects/recommended
// @access  Private (FREELANCER)
const getRecommendedProjects = async (req, res, next) => {
  try {
    const recommendations = await getRecommendedProjectsForFreelancer(req.user._id, 6);
    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects,
  getRecommendedProjects,
};
