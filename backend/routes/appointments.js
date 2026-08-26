const router = require('express').Router();
const { createAppointment, getAppointments, getAppointment, updateAppointmentStatus, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id/status', authorize('salon_owner', 'staff', 'admin'), updateAppointmentStatus);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
