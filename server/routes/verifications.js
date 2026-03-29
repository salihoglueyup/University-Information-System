const router = require('express').Router();
const verificationController = require('../controllers/verificationController');
const { verifyToken } = require('../middleware/auth');

// CREATE a new document verification record (Protected)
router.post('/create', verifyToken, verificationController.createVerification);

// VERIFY a document by its hash (Public - No Token Required)
router.get('/:hash', verificationController.getVerificationByHash);

module.exports = router;
