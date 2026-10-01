const express = require('express');
const router = express.Router();
const {
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal,
} = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my-proposals', protect, authorize('FREELANCER'), getMyProposals);
router.post('/:id/accept', protect, authorize('CLIENT', 'ADMIN'), acceptProposal);
router.post('/:id/reject', protect, authorize('CLIENT', 'ADMIN'), rejectProposal);
router.delete('/:id', protect, authorize('FREELANCER'), withdrawProposal);

module.exports = router;
