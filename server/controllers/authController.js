const authService = require('../services/authService');
const { authAttemptsTotal, authOperationDurationMs } = require('../utils/metrics');
const logger = require('../utils/logger');

// httpOnly auth cookie: not readable by JS, so a stolen-via-XSS token is no
// longer possible. sameSite=strict pairs with the existing CSRF protection.
const TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 1000 // 1h — matches the JWT "expiresIn"
};
const setTokenCookie = (res, token) => res.cookie('token', token, TOKEN_COOKIE_OPTIONS);

class AuthController {
    async register(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'register' });
        try {
            const result = await authService.registerUser(req.body);
            authAttemptsTotal.inc({ action: 'register', result: 'success' });
            res.status(201).json(result);
        } catch (err) {
            authAttemptsTotal.inc({ action: 'register', result: 'error' });
            if (err.message === 'Username already exists') {
                return res.status(409).json({ message: err.message });
            }
            res.status(500).json({ error: err.message || err });
        } finally {
            endTimer();
        }
    }

    async login(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'login' });
        try {
            const { username, password } = req.body;
            const result = await authService.loginUser(username, password);
            authAttemptsTotal.inc({ action: 'login', result: 'success' });
            // Set the token as an httpOnly cookie (skip the 2FA-pending temp token).
            if (result.accessToken) setTokenCookie(res, result.accessToken);
            res.status(200).json(result);
        } catch (err) {
            authAttemptsTotal.inc({ action: 'login', result: 'error' });
            if (err.message === 'User not found' || err.message === 'Wrong password') {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.status(500).json({ error: err.message || err });
        } finally {
            endTimer();
        }
    }

    async forgotPassword(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'forgot_password' });
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'E-posta adresi gereklidir' });
            }

            const crypto = require('crypto');
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Hash the token and persist it on the user
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const User = require('../models/User');
            const user = await User.findOne({ email });
            if (user) {
                user.passwordResetToken = hashedToken;
                user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
                await user.save({ validateBeforeSave: false });
            }

            // Always respond success to prevent email enumeration
            const messageBroker = require('../utils/messageBroker');
            const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`;
            const message = `Şifre sıfırlama talebinizi aldık. Lütfen aşağıdaki güvenli bağlantıyı kullanarak şifrenizi yenileyiniz:\n\n${resetUrl}\n\nBu işlemi siz talep etmediyseniz, lütfen Kampüs Bilgi İşlem ile iletişime geçiniz.`;

            if (user) {
                await messageBroker.publishEvent('email_notifications', {
                    email,
                    subject: 'UBIS Hesap Şifre Sıfırlama',
                    message
                });
            }

            authAttemptsTotal.inc({ action: 'forgot_password', result: 'success' });
            res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
        } catch (err) {
            authAttemptsTotal.inc({ action: 'forgot_password', result: 'error' });
            logger.error(err);
            res.status(500).json({ error: 'E-posta gönderiminde bir sorun oluştu.' });
        } finally {
            endTimer();
        }
    }
    async generate2FA(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'generate_2fa' });
        try {
            // requires a valid jwt token from a logged-in session to generate
            const result = await authService.generate2FA(req.user.id);
            authAttemptsTotal.inc({ action: 'generate_2fa', result: 'success' });
            res.status(200).json(result);
        } catch (err) {
            authAttemptsTotal.inc({ action: 'generate_2fa', result: 'error' });
            res.status(500).json({ error: err.message || err });
        } finally {
            endTimer();
        }
    }

    async verify2FA(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'verify_2fa' });
        try {
            const { token } = req.body;
            // The userId might come from a temporary token if logging in, 
            // or a standard token if enabling from settings.
            const result = await authService.verify2FA(req.user.id, token);
            authAttemptsTotal.inc({ action: 'verify_2fa', result: 'success' });
            if (result.accessToken) setTokenCookie(res, result.accessToken);
            res.status(200).json(result);
        } catch (err) {
            authAttemptsTotal.inc({ action: 'verify_2fa', result: 'error' });
            if (err.message === 'Invalid OTP Token') {
                return res.status(401).json({ message: err.message });
            }
            res.status(500).json({ error: err.message || err });
        } finally {
            endTimer();
        }
    }

    async logout(req, res) {
        res.clearCookie('token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' });
        res.status(200).json({ message: 'Çıkış yapıldı' });
    }

    async resetPassword(req, res) {
        const endTimer = authOperationDurationMs.startTimer({ action: 'reset_password' });
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(400).json({ message: 'Token ve yeni şifre gereklidir' });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
            }

            const crypto = require('crypto');
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const User = require('../models/User');

            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: new Date() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Token geçersiz veya süresi dolmuş' });
            }

            const bcrypt = require('bcrypt');
            user.password = await bcrypt.hash(password, 10);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            authAttemptsTotal.inc({ action: 'reset_password', result: 'success' });
            res.status(200).json({ message: 'Şifreniz başarıyla değiştirildi' });
        } catch (err) {
            authAttemptsTotal.inc({ action: 'reset_password', result: 'error' });
            res.status(500).json({ error: 'Şifre sıfırlamada bir sorun oluştu' });
        } finally {
            endTimer();
        }
    }
}

module.exports = new AuthController();
