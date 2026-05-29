const jwt = require('jsonwebtoken');
const { verifyToken, restrictTo, verifyOwnerOrStaff, verifyRole } = require('../middleware/auth');

describe('Auth Middleware', () => {
    const SECRET = 'test-secret';
    let req, res, next;

    beforeAll(() => {
        process.env.JWT_SEC = SECRET;
    });

    beforeEach(() => {
        req = { headers: {}, params: {}, user: null };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    describe('verifyToken', () => {
        it('should reject requests without authorization header', () => {
            verifyToken(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401
            }));
        });

        it('should reject invalid tokens', () => {
            req.headers.authorization = 'Bearer invalid.token.here';
            verifyToken(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401
            }));
        });

        it('should set req.user for valid tokens', () => {
            const token = jwt.sign({ id: 'u1', role: 'student', username: 'test' }, SECRET);
            req.headers.authorization = `Bearer ${token}`;
            verifyToken(req, res, next);
            expect(next).toHaveBeenCalledWith(); // called without error
            expect(req.user).toBeDefined();
            expect(req.user.id).toBe('u1');
            expect(req.user.role).toBe('student');
        });
    });

    describe('restrictTo', () => {
        it('should allow permitted roles', () => {
            req.user = { role: 'admin' };
            const middleware = restrictTo('admin', 'academic');
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(); // no error
        });

        it('should reject non-permitted roles', () => {
            req.user = { role: 'student' };
            const middleware = restrictTo('admin');
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403
            }));
        });
    });

    describe('verifyOwnerOrStaff', () => {
        it('should allow user to access own resource by id', () => {
            req.user = { id: 'user-123', username: 'test', role: 'student' };
            req.params = { id: 'user-123' };
            verifyOwnerOrStaff(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('should allow user to access own resource by username', () => {
            req.user = { id: 'mongo-id', username: 'B085100', role: 'student' };
            req.params = { id: 'b085100' }; // case-insensitive
            verifyOwnerOrStaff(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('should allow admin to access any resource', () => {
            req.user = { id: 'admin-1', username: 'admin', role: 'admin' };
            req.params = { id: 'another-user' };
            verifyOwnerOrStaff(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('should allow academic to access any resource', () => {
            req.user = { id: 'acad-1', username: 'prof', role: 'academic' };
            req.params = { id: 'student-1' };
            verifyOwnerOrStaff(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        it('should reject non-owner student resource access', () => {
            req.user = { id: 'user-1', username: 'student1', role: 'student' };
            req.params = { id: 'user-2' };
            verifyOwnerOrStaff(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403
            }));
        });
    });

    describe('verifyRole', () => {
        it('should reject unauthenticated requests', () => {
            const middleware = verifyRole(['admin']);
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401
            }));
        });

        it('should allow matching role with valid token', () => {
            const token = jwt.sign({ id: 'u1', role: 'admin', username: 'admin1' }, SECRET);
            req.headers.authorization = `Bearer ${token}`;
            const middleware = verifyRole(['admin']);
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(); // no error
        });

        it('should reject non-matching role with valid token', () => {
            const token = jwt.sign({ id: 'u1', role: 'student', username: 'st1' }, SECRET);
            req.headers.authorization = `Bearer ${token}`;
            const middleware = verifyRole(['admin']);
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403
            }));
        });
    });
});
