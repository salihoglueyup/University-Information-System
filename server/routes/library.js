const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// GET /api/library/catalog
router.get('/catalog', libraryController.getCatalog);

// GET /api/library/borrowed
router.get('/borrowed', libraryController.getBorrowedBooks);

// POST /api/library/borrow
router.post('/borrow', libraryController.borrowBook);

module.exports = router;
