const router = require('express').Router();
const healthAppointmentController = require('../controllers/healthAppointmentController');
const { validate } = require('../middleware/validate');

// GET /api/health-appointments — the user's medical-center appointments
router.get('/', healthAppointmentController.list);

// POST /api/health-appointments — book a new appointment
router.post('/', validate('healthAppointment'), healthAppointmentController.create);

module.exports = router;
