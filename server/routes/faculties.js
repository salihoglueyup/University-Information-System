const router = require('express').Router();
const facultyController = require('../controllers/facultyController');
const cacheMiddleware = require('../middleware/cache');

// GET ALL FACULTIES
router.get('/', cacheMiddleware, facultyController.getAllFaculties);

// GET FACULTY BY ID
router.get('/:id', facultyController.getFacultyById);

module.exports = router;
