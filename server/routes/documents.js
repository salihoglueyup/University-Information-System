const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../utils/fileUpload');
const { verifyToken } = require('../middleware/auth');

// GET ALL DOCUMENTS
router.get('/', verifyToken, documentController.getUserDocuments);

// UPLOAD DOCUMENT
router.post('/upload', verifyToken, upload.single('file'), documentController.uploadDocument);

module.exports = router;
