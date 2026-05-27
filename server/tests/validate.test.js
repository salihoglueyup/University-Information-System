const { validate, schemas } = require('../middleware/validate');

describe('Validate Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {};
        next = jest.fn();
    });

    describe('register schema', () => {
        const middleware = validate('register');

        it('should pass with valid registration data', () => {
            req.body = { username: 'testuser', email: 'test@example.com', password: 'secure123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(); // no error
            expect(req.body.username).toBe('testuser');
        });

        it('should reject username shorter than 3 chars', () => {
            req.body = { username: 'ab', email: 'valid@test.com', password: 'secure123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Zod Validation Error',
                statusCode: 400
            }));
        });

        it('should reject invalid email', () => {
            req.body = { username: 'testuser', email: 'not-an-email', password: 'secure123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Zod Validation Error'
            }));
        });

        it('should reject password shorter than 6 chars', () => {
            req.body = { username: 'testuser', email: 'test@test.com', password: '123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Zod Validation Error'
            }));
        });

        it('should accept optional fullName field and strip unknown fields', () => {
            req.body = {
                username: 'admin1', email: 'admin@test.com', password: 'secure123',
                fullName: 'Admin User', role: 'admin'
            };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
            // role should be stripped since it's not in the schema (privilege escalation prevention)
            expect(req.body.role).toBeUndefined();
        });

        it('should silently strip unrecognized fields', () => {
            req.body = { username: 'admin1', email: 'admin@test.com', password: 'secure123', role: 'superadmin' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
            expect(req.body.role).toBeUndefined();
        });
    });

    describe('login schema', () => {
        const middleware = validate('login');

        it('should pass with valid login data', () => {
            req.body = { username: 'testuser', password: 'secure123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('should reject empty username', () => {
            req.body = { username: '', password: 'secure123' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Zod Validation Error'
            }));
        });

        it('should reject missing password', () => {
            req.body = { username: 'testuser' };
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                error: 'Zod Validation Error'
            }));
        });
    });

    describe('unknown schema', () => {
        it('should skip validation for undefined schema', () => {
            const middleware = validate('nonexistent');
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(); // passes through
        });
    });

    describe('schemas export', () => {
        it('should export register, login, forgotPassword schemas', () => {
            expect(schemas.register).toBeDefined();
            expect(schemas.login).toBeDefined();
            expect(schemas.forgotPassword).toBeDefined();
        });
    });
});
