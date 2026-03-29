const jwt = require('jsonwebtoken');
const secureUploads = require('../middleware/secureUploads');

describe('secureUploads middleware', () => {
    const originalJwtSec = process.env.JWT_SEC;

    beforeAll(() => {
        process.env.JWT_SEC = 'test-secret-key';
    });

    afterAll(() => {
        process.env.JWT_SEC = originalJwtSec;
    });

    const runMiddleware = (req) => new Promise((resolve) => {
        secureUploads(req, {}, (err) => resolve(err));
    });

    it('should reject requests without token', async () => {
        const err = await runMiddleware({ headers: {}, query: {}, path: '/abc-file.pdf' });
        expect(err).toBeDefined();
        expect(err.statusCode).toBe(401);
    });

    it('should allow owner to access own file', async () => {
        const token = jwt.sign({ id: 'user-123', role: 'student' }, process.env.JWT_SEC);
        const err = await runMiddleware({
            headers: { authorization: `Bearer ${token}` },
            query: {},
            path: '/user-123-1700000000000-1.pdf'
        });
        expect(err).toBeUndefined();
    });

    it('should allow admin to access any file', async () => {
        const token = jwt.sign({ id: 'admin-1', role: 'admin' }, process.env.JWT_SEC);
        const err = await runMiddleware({
            headers: { authorization: `Bearer ${token}` },
            query: {},
            path: '/another-user-1700000000000-1.pdf'
        });
        expect(err).toBeUndefined();
    });

    it('should reject non-owner non-staff file access', async () => {
        const token = jwt.sign({ id: 'user-1', role: 'student' }, process.env.JWT_SEC);
        const err = await runMiddleware({
            headers: { authorization: `Bearer ${token}` },
            query: {},
            path: '/user-2-1700000000000-1.pdf'
        });
        expect(err).toBeDefined();
        expect(err.statusCode).toBe(403);
    });
});
