const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Kontrol et
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Yoksa oluştur
                const username = profile.emails[0].value.split('@')[0];
                user = await User.create({
                    username: username + crypto.randomBytes(4).toString('hex'),
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(32).toString('hex'),
                    googleId: profile.id,
                    fullName: profile.displayName,
                    role: 'student' // Default role
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

module.exports = passport;
