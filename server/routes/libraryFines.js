const router = require('express').Router();
const libraryFineController = require('../controllers/libraryFineController');

// GET /api/library-fines — the user's fines (paid + unpaid)
router.get('/', libraryFineController.list);

// PATCH /api/library-fines/:id/pay — pay an outstanding fine
router.patch('/:id/pay', libraryFineController.pay);

module.exports = router;
