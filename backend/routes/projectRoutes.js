const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects,
  getRecommendedProjects,
} = require('../controllers/projectController');
const {
  submitProposal,
  getProjectProposals,
} = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public project browsing
router.get('/', getProjects);

// Authenticated client/freelancer specific endpoints
router.get('/client/my-projects', protect, authorize('CLIENT', 'ADMIN'), getClientProjects);
router.get('/recommended', protect, authorize('FREELANCER'), getRecommendedProjects);

// Project details
router.get('/:id', (req, res, next) => {
  // Optional auth: if token is supplied, attach user for personalized recommendation scoring
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => getProjectById(req, res, next));
  }
  return getProjectById(req, res, next);
});

// Client project modifications
router.post('/', protect, authorize('CLIENT', 'ADMIN'), createProject);
router.put('/:id', protect, authorize('CLIENT', 'ADMIN'), updateProject);
router.delete('/:id', protect, authorize('CLIENT', 'ADMIN'), deleteProject);

// Nested proposal endpoints for a project
router.post('/:projectId/proposals', protect, authorize('FREELANCER'), submitProposal);
router.get('/:projectId/proposals', protect, authorize('CLIENT', 'ADMIN'), getProjectProposals);

module.exports = router;
