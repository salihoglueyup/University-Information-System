const AppError = require('../utils/AppError');
const errorHandler = require('../middleware/errorHandler');

// Mock logger to suppress output during tests
jest.mock('../utils/logger', () => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
}));

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.NODE_ENV = 'development';
    });

    it('should handle AppError with correct status code', () => {
        const err = new AppError('Resource not found', 404);
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'fail',
            message: 'Resource not found'
        }));
    });

    it('should default to 500 for unknown errors', () => {
        const err = new Error('Something broke');
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle Zod validation errors with 400 status', () => {
        const err = new Error('Zod Validation Error');
        err.error = 'Zod Validation Error';
        err.messages = ['Field is required', 'Invalid email'];
        err.statusCode = 400;
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'fail',
            messages: expect.arrayContaining(['Field is required', 'Invalid email'])
        }));
    });

    it('should handle Mongoose duplicate key error', () => {
        const err = new Error('Duplicate key');
        err.code = 11000;
        err.errmsg = 'duplicate key error "testvalue"';
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle Mongoose ValidationError', () => {
        const err = new Error('Validation failed');
        err.name = 'ValidationError';
        err.errors = {
            field1: { message: 'Field1 is required' },
            field2: { message: 'Field2 must be valid' }
        };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle JsonWebTokenError', () => {
        const err = new Error('jwt malformed');
        err.name = 'JsonWebTokenError';
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should handle TokenExpiredError', () => {
        const err = new Error('jwt expired');
        err.name = 'TokenExpiredError';
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should hide error details in production for non-operational errors', () => {
        process.env.NODE_ENV = 'production';
        const err = new Error('DB connection lost');
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'Something went very wrong!'
        }));
    });

    it('should show operational error details in production', () => {
        process.env.NODE_ENV = 'production';
        const err = new AppError('Not found', 404);
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'fail',
            message: 'Not found'
        }));
    });
});
