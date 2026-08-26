const router = require('express').Router();
const { getStaff, getStaffMember, createStaff, updateStaff, deleteStaff, updateWorkingHours, requestLeave, manageLeave } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getStaff);
router.get('/:id', getStaffMember);
router.post('/', protect, authorize('salon_owner', 'admin'), createStaff);
router.put('/:id', protect, authorize('salon_owner', 'admin'), updateStaff);
router.delete('/:id', protect, authorize('salon_owner', 'admin'), deleteStaff);
router.put('/:id/working-hours', protect, authorize('salon_owner', 'admin', 'staff'), updateWorkingHours);
router.post('/:id/leave', protect, authorize('staff', 'salon_owner'), requestLeave);
router.put('/:staffId/leave/:leaveId', protect, authorize('salon_owner', 'admin'), manageLeave);

module.exports = router;
