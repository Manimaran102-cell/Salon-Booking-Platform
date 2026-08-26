const router = require('express').Router();
const { getServices, getService, createService, updateService, deleteService, getCategories } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getService);
router.post('/', protect, authorize('salon_owner', 'admin'), createService);
router.put('/:id', protect, authorize('salon_owner', 'admin'), updateService);
router.delete('/:id', protect, authorize('salon_owner', 'admin'), deleteService);

module.exports = router;
