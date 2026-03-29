const router = require('express').Router();
const gradeController = require('../controllers/gradeController');
const { verifyToken, restrictTo } = require('../middleware/auth');

// GET GRADES FOR USER
router.get('/', gradeController.getByUser);

// CREATE/UPDATE GRADES FOR USER
// Only admins/academics can create/update grades
router.post('/', verifyToken, restrictTo('admin', 'academic'), gradeController.save);

module.exports = router;
