const router = require('express').Router();
const { getReviews, createReview, replyToReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', protect, authorize('customer'), createReview);
router.put('/:id/reply', protect, authorize('salon_owner', 'admin'), replyToReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
