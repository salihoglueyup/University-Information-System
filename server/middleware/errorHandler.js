const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Duplicate key error (Mongoose)
    if (err.code === 11000) {
        const match = (err.errmsg || err.message || '').match(/(["'])(\\?.)*?\1/);
        const value = match ? match[0] : 'unknown';
        const message = `Duplicate field value: ${value}. Please use another value!`;
        err = new AppError(message, 400);
    }

    // Validation error (Mongoose)
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        err = new AppError(message, 400);
    }

    // Cast error (Mongoose) — e.g. a malformed ObjectId from client input.
    // Without this it surfaces as a non-operational 500 instead of a 400.
    if (err.name === 'CastError') {
        err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    // Zod Validation Error
    if (err.error === 'Zod Validation Error' || err.name === 'ZodError') {
        const message = err.messages ? err.messages.join('. ') : err.message;
        const messages = err.messages || [err.message];
        err = new AppError(message || 'Geçersiz veri biçimi', 400);
        err.messages = messages;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
        err = new AppError('Your token has expired! Please log in again.', 401);
    }

    // CSRF Errors (supports both csurf legacy and csrf-csrf)
    if (err.code === 'EBADCSRFTOKEN' || (err.message && err.message.includes('csrf token') && !err.name.includes('Type'))) {
        err = new AppError('Invalid or missing CSRF token. Please refresh the page.', 403);
    }

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            messages: err.messages,
            stack: err.stack
        });
    } else {
        // Production: send generic messages for programming bugs
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                messages: err.messages
            });
        } else {
            // Programming or other unknown error: don't leak error details
            logger.error('Unexpected error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};

module.exports = errorHandler;
