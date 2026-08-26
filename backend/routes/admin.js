const router = require('express').Router();
const { getDashboardStats, getUsers, updateUser, toggleUserActive, getAllSalons, toggleSalonActive, toggleSalonFeatured, getAllAppointments, getAllReviews } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/salons', getAllSalons);
router.put('/salons/:id/toggle-active', toggleSalonActive);
router.put('/salons/:id/toggle-featured', toggleSalonFeatured);
router.get('/appointments', getAllAppointments);
router.get('/reviews', getAllReviews);

module.exports = router;
