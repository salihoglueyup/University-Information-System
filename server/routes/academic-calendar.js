const router = require('express').Router();
const academicCalendarController = require('../controllers/academicCalendarController');
const cacheMiddleware = require('../middleware/cache');

// GET ALL ACADEMIC CALENDAR EVENTS
router.get('/', cacheMiddleware, academicCalendarController.getAllEvents);

// CREATE ACADEMIC CALENDAR EVENT
router.post('/', academicCalendarController.createEvent);

module.exports = router;
