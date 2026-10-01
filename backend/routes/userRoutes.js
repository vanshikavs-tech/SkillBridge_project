const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getFreelancers,
  addPortfolioItem,
  deletePortfolioItem,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/freelancers', getFreelancers);
router.get('/:id', getProfile);

// Authenticated user profile routes
router.put('/profile', protect, updateProfile);
router.post('/portfolio', protect, authorize('FREELANCER'), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, authorize('FREELANCER'), deletePortfolioItem);

module.exports = router;
