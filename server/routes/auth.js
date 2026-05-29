const router = require('express').Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyToken, verifyTokenAllowPending } = require('../middleware/auth');
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

// LOGOUT — clears the httpOnly auth cookie
router.post('/logout', authController.logout);

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

// RESET PASSWORD
router.post('/reset-password', authController.resetPassword);

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
        // Issue the JWT as an httpOnly cookie instead of putting it in the redirect
        // URL (URLs leak into logs, browser history and Referer headers).
        const authService = require('../services/authService');
        const token = authService.generateToken(req.user);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 1000
        });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${clientUrl}/auth/callback`);
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
// Accepts the temporary 2FA token (is2FAPending) so login-time verification works.
router.post('/2fa/verify', verifyTokenAllowPending, authController.verify2FA);

module.exports = router;
