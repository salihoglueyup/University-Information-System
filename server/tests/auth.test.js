const request = require('supertest');
const app = require('./app.test');

// Mock Auth Service so we don't connect to Real DB
jest.mock('../services/authService', () => ({
    registerUser: jest.fn().mockImplementation((data) => {
        if (data.username === 'existing') {
            throw new Error('Username already exists');
        }
        return Promise.resolve({
            _id: 'mockId123',
            username: data.username,
            email: data.email
        });
    }),
    loginUser: jest.fn().mockImplementation((username, password) => {
        if (username === 'testuser' && password === 'correctpass') {
            return Promise.resolve({ accessToken: 'mocked_jwt_token', user: { username: 'testuser' } });
        }
        throw new Error('User not found');
    })
}));

describe('Authentication API Controller', () => {

    describe('POST /api/auth/register', () => {
        it('should block registration with invalid payload (Zod validation)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'ab', // Too short
                    email: 'invalid-email',
                    password: '123' // Too short
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.messages).toBeDefined();
        });

        it('should successfully register a new user with perfect payload', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'newuser',
                    email: 'newuser@test.com',
                    password: 'securepassword123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.username).toEqual('newuser');
        });

        it('should return 409 if username exists', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'existing',
                    email: 'existing@test.com',
                    password: 'securepassword123'
                });

            expect(res.statusCode).toEqual(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return accessToken upon successful login', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'correctpass'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.accessToken).toBeDefined();
        });

        it('should block login without username/password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser' });

            expect(res.statusCode).toEqual(400); // Zod Error
        });
    });
});
