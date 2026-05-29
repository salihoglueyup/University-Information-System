const router = require('express').Router();
const lostFoundController = require('../controllers/lostFoundController');

// GET /api/lost-found?type=found|lost&search=...
router.get('/', lostFoundController.list);

// POST /api/lost-found  (report a lost/found item)
router.post('/', lostFoundController.create);

module.exports = router;
