const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

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
                    username: username + Math.floor(Math.random() * 1000),
                    email: profile.emails[0].value,
                    password: 'sso_generated_password_123!', // Normal şifre girişi yapılmayacak
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
