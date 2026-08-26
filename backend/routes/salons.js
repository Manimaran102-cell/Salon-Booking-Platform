const router = require('express').Router();
const { getSalons, getSalon, getSalonBySlug, createSalon, updateSalon, deleteSalon, getMySalon } = require('../controllers/salonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSalons);
router.get('/my-salon', protect, authorize('salon_owner'), getMySalon);
router.get('/slug/:slug', getSalonBySlug);
router.get('/:id', getSalon);
router.post('/', protect, authorize('salon_owner', 'admin'), createSalon);
router.put('/:id', protect, authorize('salon_owner', 'admin'), updateSalon);
router.delete('/:id', protect, authorize('salon_owner', 'admin'), deleteSalon);

module.exports = router;
