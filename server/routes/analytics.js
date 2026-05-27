const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const cacheMiddleware = require('../middleware/cache');
const { verifyToken, restrictTo } = require('../middleware/auth');

// GET /api/analytics
// Admin Dashboard için Genel Sistem İstatistikleri (Aggregation)
router.get('/', verifyToken, restrictTo('admin'), cacheMiddleware, analyticsController.getGeneralAnalytics);

// GET /api/analytics/gpa-distribution
// Fakülte bazında not ortalaması dağılım istatistikleri
router.get('/gpa-distribution', verifyToken, restrictTo('admin', 'academic'), cacheMiddleware, analyticsController.getFacultyGpaDistribution);

module.exports = router;
