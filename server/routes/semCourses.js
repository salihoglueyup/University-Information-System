const router = require('express').Router();
const semCourseController = require('../controllers/semCourseController');

// GET /api/sem-courses — continuing-education catalog
router.get('/', semCourseController.list);

// POST /api/sem-courses/:id/enroll — enroll the user in a program
router.post('/:id/enroll', semCourseController.enroll);

module.exports = router;
