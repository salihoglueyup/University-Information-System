const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) return next(new AppError("Token is not valid!", 403));
            req.user = user;
            next();
        });
    } else {
        return next(new AppError("You are not authenticated!", 401));
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user must be populated by verifyToken before this middleware
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
};

const verifyOwnerOrStaff = (req, res, next) => {
    // Requires verifyToken to be run first
    // req.params.id is the target user's id
    if (req.user.id === req.params.id || req.user.role === 'admin' || req.user.role === 'academic') {
        next();
    } else {
        return next(new AppError("You are not authorized to access this resource", 403));
    }
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        verifyToken(req, res, () => {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return next(new AppError("You are not authorized to perform this action!", 403));
            }
        });
    };
};

module.exports = { verifyToken, verifyRole, restrictTo, verifyOwnerOrStaff };
