const router = require('express').Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');
const passport = require('../utils/passportConfig');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Başarılı kayıt
 *       400:
 *         description: Geçersiz girdi
 */
// REGISTER
router.post('/register', validate('register'), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarılı giriş ve JWT Token döner
 *       401:
 *         description: Geçersiz şifre veya kullanıcı adı
 */
// LOGIN
router.post('/login', validate('login'), authController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama bağlantısı gönder
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre yenileme maili atıldı
 */
// FORGOT PASSWORD
router.post('/forgot-password', validate('forgotPassword'), authController.forgotPassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google SSO üzerinden giriş başlatır.
 *     tags: [Auth]
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google SSO dönüş (callback) endpointi.
 *     tags: [Auth]
 */
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        // Create JWT token and redirect to frontend
        const authService = require('../services/authService');
        const token = authService.generateToken(req.user);

        // Redirect to React dashboard with token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    }
);

/**
 * @swagger
 * /auth/2fa/generate:
 *   post:
 *     summary: Generate 2FA Secret for the authenticated user
 *     tags: [Auth]
 */
router.post('/2fa/generate', verifyToken, authController.generate2FA);

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verify 2FA OTP Code
 *     tags: [Auth]
 */
router.post('/2fa/verify', verifyToken, authController.verify2FA);

module.exports = router;
