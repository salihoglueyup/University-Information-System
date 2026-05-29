const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// allowPending: when true, accepts the temporary 2FA token (is2FAPending).
// Only the /2fa/verify route should allow it — every other protected route
// must reject pending tokens so 2FA cannot be bypassed by using the temp token.
const buildVerifyToken = (allowPending) => (req, res, next) => {
    // Prefer the httpOnly cookie (not readable by JS -> not exposed to XSS);
    // fall back to the Authorization header for API clients / backward compat.
    const headerToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    const token = (req.cookies && req.cookies.token) || headerToken;

    if (!token) {
        return next(new AppError("You are not authenticated!", 401));
    }

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) return next(new AppError("Token is not valid or has expired!", 401));
        if (user && user.is2FAPending && !allowPending) {
            return next(new AppError("Two-factor authentication is required to complete sign-in.", 401));
        }
        req.user = user;
        next();
    });
};

const verifyToken = buildVerifyToken(false);
const verifyTokenAllowPending = buildVerifyToken(true);

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
    // req.params.id can be Mongo user id or student number/username (e.g. B085100)
    const rawParamId = String(req.params.id || '').trim();
    const userId = String(req.user.id || '').trim();
    const paramIdLower = rawParamId.toLowerCase();
    const usernameLower = String(req.user.username || '').trim().toLowerCase();

    if (
        userId === rawParamId ||
        usernameLower === paramIdLower ||
        req.user.role === 'admin' ||
        req.user.role === 'academic'
    ) {
        next();
    } else {
        return next(new AppError("You are not authorized to access this resource", 403));
    }
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        verifyToken(req, res, (err) => {
            if (err) return next(err);
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return next(new AppError("You are not authorized to perform this action!", 403));
            }
        });
    };
};

module.exports = { verifyToken, verifyTokenAllowPending, verifyRole, restrictTo, verifyOwnerOrStaff };
