const authService = require('../services/authService');
const { authAttemptsTotal, authOperationDurationMs } = require('../utils/metrics');

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
            res.status(200).json(result);
        } catch (err) {
            authAttemptsTotal.inc({ action: 'login', result: 'error' });
            if (err.message === 'User not found') {
                return res.status(404).json({ message: err.message });
            }
            if (err.message === 'Wrong password') {
                return res.status(400).json({ message: err.message });
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
            // For now, assume it's valid and send a mock reset link
            const messageBroker = require('../utils/messageBroker');

            const message = `Şifre sıfırlama talebinizi aldık. Lütfen aşağıdaki güvenli bağlantıyı kullanarak şifrenizi yenileyiniz:\n\nhttp://localhost:5173/auth/reset-password?token=mock_secure_token_123\n\nBu işlemi siz talep etmediyseniz, lütfen Kampüs Bilgi İşlem ile iletişime geçiniz.`;

            // Add to RabbitMQ background events
            await messageBroker.publishEvent('email_notifications', {
                email,
                subject: 'UBIS Hesap Şifre Sıfırlama',
                message
            });

            authAttemptsTotal.inc({ action: 'forgot_password', result: 'success' });

            res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
        } catch (err) {
            authAttemptsTotal.inc({ action: 'forgot_password', result: 'error' });
            console.error(err);
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
}

module.exports = new AuthController();
