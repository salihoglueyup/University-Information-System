const router = require('express').Router();
const departmentController = require('../controllers/departmentController');
const cacheMiddleware = require('../middleware/cache');

// GET ALL DEPARTMENTS
router.get('/', cacheMiddleware, departmentController.getDepartments);

module.exports = router;
