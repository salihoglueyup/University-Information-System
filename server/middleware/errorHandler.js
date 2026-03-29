const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Duplicate key error (Mongoose)
    if (err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;
        err = new AppError(message, 400);
    }

    // Validation error (Mongoose)
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        err = new AppError(message, 400);
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

    // CSRF Errors
    if (err.code === 'EBADCSRFTOKEN') {
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
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};

module.exports = errorHandler;
