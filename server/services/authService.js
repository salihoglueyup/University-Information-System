const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const SALT_ROUNDS = 10;

class AuthService {
    async registerUser(userData) {
        const { username, password, fullName } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            username,
            password: hashedPassword,
            fullName
        });

        const savedUser = await newUser.save();
        const { password: _userPassword, ...otherDetails } = savedUser._doc;

        return otherDetails;
    }

    async loginUser(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Wrong password');
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SEC,
            { expiresIn: "1h" }
        );

        const { password: _userPassword, ...otherDetails } = user._doc;
        
        if (user.isTwoFactorEnabled) {
            // Give a temporary token or just signal to the frontend
            const tempToken = jwt.sign(
                { id: user._id, role: user.role, is2FAPending: true },
                process.env.JWT_SEC,
                { expiresIn: "10m" }
            );
            return { requires2FA: true, tempToken, user: { username: user.username } };
        }

        return { ...otherDetails, accessToken };
    }

    async generate2FA(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const secret = speakeasy.generateSecret({
            name: `UBIS_${user.username}`
        });

        user.twoFactorSecret = secret.base32;
        await user.save();

        const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        return {
            secret: secret.base32,
            qrCode: qrCodeDataUrl
        };
    }

    async verify2FA(userId, token) {
        const user = await User.findById(userId);
        if (!user || (!user.twoFactorSecret && user.isTwoFactorEnabled)) {
            throw new Error('2FA secret is missing');
        }

        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (isValid) {
            // Once valid, if not enabled yet, enable it
            if (!user.isTwoFactorEnabled) {
                user.isTwoFactorEnabled = true;
                await user.save();
            }

            // Issue real token
            const accessToken = jwt.sign(
                { id: user._id, role: user.role, username: user.username },
                process.env.JWT_SEC,
                { expiresIn: "1h" }
            );

            const { password: _password, twoFactorSecret: _twoFactorSecret, ...otherDetails } = user._doc;
            return { ...otherDetails, accessToken };
        }

        throw new Error('Invalid OTP Token');
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SEC,
            { expiresIn: '1h' }
        );
    }
}

module.exports = new AuthService();
