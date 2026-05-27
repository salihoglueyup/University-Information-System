const path = require('path');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
};

module.exports = (req, _res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return next(new AppError('You are not authenticated!', 401));
    }

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
            return next(new AppError('Token is not valid!', 403));
        }

        const requestedFile = path.basename(req.path || '');
        const isOwnerFile = requestedFile.startsWith(`${user.id}-`);
        const isStaff = user.role === 'admin' || user.role === 'academic';

        if (isStaff || isOwnerFile) {
            req.user = user;
            return next();
        }

        return next(new AppError('You are not authorized to access this file', 403));
    });
};
