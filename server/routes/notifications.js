const router = require('express').Router();
const notificationController = require('../controllers/notificationController');

// GET current user's notifications (most recent first)
router.get('/', notificationController.list);

// Mark all as read — declared before '/:id/read' so it isn't captured as an id
router.patch('/read-all', notificationController.markAllRead);

// Mark a single notification as read
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
