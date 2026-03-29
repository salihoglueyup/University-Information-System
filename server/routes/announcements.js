const router = require('express').Router();
const announcementController = require('../controllers/announcementController');
const { verifyToken, restrictTo } = require('../middleware/auth');

// CREATE ANNOUNCEMENT
// Only admins/academics can create announcements
router.post('/', verifyToken, restrictTo('admin', 'academic'), announcementController.create);

// GET ALL ANNOUNCEMENTS
router.get('/', announcementController.getAll);

module.exports = router;
