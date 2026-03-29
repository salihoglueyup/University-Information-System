const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET PAYMENTS OVERVIEW
router.get('/', paymentController.getPaymentOverview);

// POST PAY TUITION
router.post('/pay-tuition', paymentController.payTuition);

// POST NEW TRANSACTION
router.post('/transaction', paymentController.createTransaction);

// GET MONTHLY FINANCE STATS (Admin Aggregation)
router.get('/finance-stats', paymentController.getMonthlyFinanceStats);

module.exports = router;
