const User = require('../models/User');
const Project = require('../models/Project');

/**
 * Recommendation & AI Matching Service
 * 
 * Concept:
 * Ranks compatibility between a project's requirements and a freelancer's profile.
 * 
 * Formula:
 * Score = (Skill Match × 0.40) +
 *         (Experience × 0.20) +
 *         (Rating × 0.20) +
 *         (Budget Compatibility × 0.10) +
 *         (Completion Rate × 0.10)
 * 
 * Output is normalized to a percentage (0 to 100%).
 */

const calculateCompatibilityScore = (freelancer, project) => {
  // 1. Skill Match (40% weight)
  const projectSkills = (project.skills || []).map((s) => s.toLowerCase().trim());
  const freelancerSkills = (freelancer.skills || []).map((s) => s.toLowerCase().trim());

  let skillMatchRatio = 0;
  if (projectSkills.length > 0) {
    const matchedCount = projectSkills.filter((s) => freelancerSkills.includes(s)).length;
    skillMatchRatio = matchedCount / projectSkills.length;
  }

  // 2. Experience Level Compatibility (20% weight)
  const expWeights = { ENTRY: 1, INTERMEDIATE: 2, EXPERT: 3 };
  const projectExp = expWeights[project.experienceLevel] || 2;
  const freelancerExp = expWeights[freelancer.experienceLevel] || 2;

  let expRatio = 1.0;
  if (freelancerExp < projectExp) {
    expRatio = 0.6; // Under-qualified penalty
  } else if (freelancerExp > projectExp) {
    expRatio = 0.95; // Slightly over-qualified
  }

  // 3. Rating Score (20% weight, max 5.0)
  const ratingRatio = Math.min(1.0, (freelancer.rating || 5.0) / 5.0);

  // 4. Budget Compatibility (10% weight)
  // Check if freelancer's hourly rate fits roughly within project budget estimation
  let budgetRatio = 1.0;
  if (freelancer.hourlyRate > 0 && project.budget && project.budget.max > 0) {
    const estimatedHours = 40; // rough baseline
    const estimatedCost = freelancer.hourlyRate * estimatedHours;
    if (estimatedCost > project.budget.max * 1.5) {
      budgetRatio = 0.5; // significantly above client max
    } else if (estimatedCost < project.budget.min * 0.5) {
      budgetRatio = 0.8;
    }
  }

  // 5. Completion Rate / Reliability (10% weight)
  const completed = freelancer.completedProjectsCount || 0;
  const completionRatio = completed > 0 ? Math.min(1.0, 0.7 + completed * 0.05) : 0.8;

  // Composite weighted score (0 to 100)
  const finalScore =
    skillMatchRatio * 40 +
    expRatio * 20 +
    ratingRatio * 20 +
    budgetRatio * 10 +
    completionRatio * 10;

  return Math.round(Math.min(100, Math.max(10, finalScore)));
};

/**
 * Get top recommended projects for a freelancer
 */
const getRecommendedProjectsForFreelancer = async (freelancerId, limit = 6) => {
  const freelancer = await User.findById(freelancerId);
  if (!freelancer) return [];

  // Fetch open projects
  const openProjects = await Project.find({ status: 'OPEN' })
    .populate('clientId', 'name avatar location')
    .sort({ createdAt: -1 })
    .limit(50);

  // Compute scores and sort descending
  const scored = openProjects.map((project) => {
    const matchScore = calculateCompatibilityScore(freelancer, project);
    return {
      project,
      matchScore,
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
};

/**
 * Get top recommended freelancers for a specific project
 */
const getRecommendedFreelancersForProject = async (projectId, limit = 6) => {
  const project = await Project.findById(projectId);
  if (!project) return [];

  const freelancers = await User.find({
    role: 'FREELANCER',
    isSuspended: false,
  }).limit(50);

  const scored = freelancers.map((freelancer) => {
    const matchScore = calculateCompatibilityScore(freelancer, project);
    return {
      freelancer,
      matchScore,
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
};

module.exports = {
  calculateCompatibilityScore,
  getRecommendedProjectsForFreelancer,
  getRecommendedFreelancersForProject,
};
