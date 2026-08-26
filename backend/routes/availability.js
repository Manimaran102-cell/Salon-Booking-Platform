const router = require('express').Router();
const { getAvailability } = require('../controllers/availabilityController');

router.get('/', getAvailability);

module.exports = router;
