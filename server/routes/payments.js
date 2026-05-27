const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// All payment routes require authentication
router.use(verifyToken);

// GET PAYMENTS OVERVIEW
router.get('/', paymentController.getPaymentOverview);

// POST PAY TUITION
router.post('/pay-tuition', paymentController.payTuition);

// POST NEW TRANSACTION
router.post('/transaction', paymentController.createTransaction);

// GET MONTHLY FINANCE STATS (Admin only)
router.get('/finance-stats', verifyRole(['admin']), paymentController.getMonthlyFinanceStats);

module.exports = router;
