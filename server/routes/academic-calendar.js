const router = require('express').Router();
const academicCalendarController = require('../controllers/academicCalendarController');
const cacheMiddleware = require('../middleware/cache');
const { restrictTo } = require('../middleware/auth');

// GET ALL ACADEMIC CALENDAR EVENTS
router.get('/', cacheMiddleware, academicCalendarController.getAllEvents);

// CREATE ACADEMIC CALENDAR EVENT
router.post('/', restrictTo('admin', 'academic'), academicCalendarController.createEvent);

module.exports = router;
