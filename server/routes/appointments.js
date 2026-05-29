const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const { validate } = require('../middleware/validate');

// Appointments
router.get('/', appointmentController.list);
router.post('/', validate('appointmentCreate'), appointmentController.create);
router.patch('/:id/status', validate('appointmentStatus'), appointmentController.updateStatus);

// Office hours (advisor availability)
router.get('/office-hours', appointmentController.listOfficeHours);
router.post('/office-hours', validate('officeHour'), appointmentController.createOfficeHour);

module.exports = router;
