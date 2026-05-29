const router = require('express').Router();
const erasmusController = require('../controllers/erasmusController');
const { validate } = require('../middleware/validate');

// Applications
router.get('/', erasmusController.listApplications);
router.post('/', validate('erasmusApply'), erasmusController.createApplication);

// University preference choices
router.get('/choices', erasmusController.listChoices);
router.post('/choices', validate('erasmusChoice'), erasmusController.createChoice);

module.exports = router;
