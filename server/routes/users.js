const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Kullanıcı profili ve yönetim endpointleri
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Oturum açmış kullanıcının profil bilgilerini getirir.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profili
 *       401:
 *         description: Yetkisiz erişim
 */
// GET USER PROFILE
router.get('/profile', verifyToken, userController.getUserProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Tüm kullanıcıları listeler (Sadece Admin)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 */
// GET ALL USERS (ADMIN ONLY)
router.get('/', verifyRole(['admin']), userController.getAllUsers);

// CREATE USER WITH ANY ROLE (ADMIN ONLY)
router.post('/', verifyRole(['admin']), validate('adminCreateUser'), userController.createUser);

// UPDATE USER ROLE/INFO (ADMIN ONLY)
router.put('/:id', verifyRole(['admin']), userController.updateUser);

// DELETE USER (ADMIN ONLY)
router.delete('/:id', verifyRole(['admin']), userController.deleteUser);

module.exports = router;
