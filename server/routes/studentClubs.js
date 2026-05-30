const router = require('express').Router();
const studentClubController = require('../controllers/studentClubController');

// GET /api/student-clubs — the club catalog
router.get('/', studentClubController.list);

// POST /api/student-clubs/:id/join — join a club
router.post('/:id/join', studentClubController.join);

module.exports = router;
