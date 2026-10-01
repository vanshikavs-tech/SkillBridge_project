const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  toggleUserSuspension,
  getAllProjects,
  deleteProjectAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleUserSuspension);
router.get('/projects', getAllProjects);
router.delete('/projects/:id', deleteProjectAdmin);

module.exports = router;
