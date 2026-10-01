const express = require('express');
const router = express.Router();
const {
  getContracts,
  getContractById,
  updateMilestoneStatus,
  completeContract,
} = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getContracts);
router.get('/:id', getContractById);
router.put('/:id/milestones/:milestoneId', updateMilestoneStatus);
router.post('/:id/complete', completeContract);

module.exports = router;
