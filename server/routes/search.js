const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyRole } = require('../middleware/auth');

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Tüm sistemde arama yapar (Öğrenciler, Dersler, Duyurular)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Arama metni
 *     responses:
 *       200:
 *         description: Arama sonuçları
 */
router.get('/', searchController.search);

/**
 * @swagger
 * /search/sync:
 *   post:
 *     summary: MongoDB verilerini MeiliSearch'e senkronize eder (Sadece Admin)
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Senkronizasyon başarılı
 */
router.post('/sync', verifyRole(['admin']), searchController.syncData);

module.exports = router;
