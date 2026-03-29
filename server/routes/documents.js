const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../utils/fileUpload');

// GET ALL DOCUMENTS
router.get('/', documentController.getUserDocuments);

// UPLOAD DOCUMENT
router.post('/upload', upload.single('file'), documentController.uploadDocument);

module.exports = router;
