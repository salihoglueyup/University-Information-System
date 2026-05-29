const router = require('express').Router();
const lostFoundController = require('../controllers/lostFoundController');
const { validate } = require('../middleware/validate');

// GET /api/lost-found?type=found|lost&search=...
router.get('/', lostFoundController.list);

// POST /api/lost-found  (report a lost/found item)
router.post('/', validate('lostFound'), lostFoundController.create);

module.exports = router;
