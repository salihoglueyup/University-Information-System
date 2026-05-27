const router = require('express').Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /ai/ask:
 *   post:
 *     summary: UBIS AI Assistant'a soru sor
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI Yanıtı
 */
router.post('/ask', verifyToken, aiController.ask);

module.exports = router;
