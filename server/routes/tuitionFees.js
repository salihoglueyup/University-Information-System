const router = require('express').Router();
const tuitionFeeController = require('../controllers/tuitionFeeController');

// GET /api/tuition-fees — the user's term tuition fees
router.get('/', tuitionFeeController.list);

// PATCH /api/tuition-fees/:id/pay — pay an outstanding fee
router.patch('/:id/pay', tuitionFeeController.pay);

module.exports = router;
