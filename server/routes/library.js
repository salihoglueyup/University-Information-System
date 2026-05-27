const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { verifyToken } = require('../middleware/auth');

// GET /api/library/catalog
router.get('/catalog', libraryController.getCatalog);

// GET /api/library/borrowed
router.get('/borrowed', verifyToken, libraryController.getBorrowedBooks);

// POST /api/library/borrow
router.post('/borrow', verifyToken, libraryController.borrowBook);

module.exports = router;
