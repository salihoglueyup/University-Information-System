const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// GET ALL EMAILS for logged-in user
router.get('/', emailController.getUserEmails);

// POST send new email
router.post('/send', emailController.sendEmail);

module.exports = router;
