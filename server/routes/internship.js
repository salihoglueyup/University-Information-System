const router = require('express').Router();
const internshipController = require('../controllers/internshipController');

// GET /api/internship — current user's mandatory-internship status
router.get('/', internshipController.getStatus);

// GET /api/internship/offers — global internship listings
router.get('/offers', internshipController.listOffers);

module.exports = router;
