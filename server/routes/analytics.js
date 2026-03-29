const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const cacheMiddleware = require('../middleware/cache');

// GET /api/analytics
// Admin Dashboard için Genel Sistem İstatistikleri (Aggregation)
router.get('/', cacheMiddleware, analyticsController.getGeneralAnalytics);

// GET /api/analytics/gpa-distribution
// Fakülte bazında not ortalaması dağılım istatistikleri
router.get('/gpa-distribution', cacheMiddleware, analyticsController.getFacultyGpaDistribution);

module.exports = router;
