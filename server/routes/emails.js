const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { verifyToken } = require('../middleware/auth');

// GET ALL EMAILS for logged-in user
router.get('/', verifyToken, emailController.getUserEmails);

// POST send new email
router.post('/send', verifyToken, emailController.sendEmail);

module.exports = router;
