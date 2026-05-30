const userService = require('../services/userService');
const User = require('../models/User');

jest.mock('../models/User');

describe('UserService', () => {
    afterEach(() => jest.clearAllMocks());

    describe('getUserProfile', () => {
        it('should return user without password', async () => {
            User.findById.mockResolvedValue({
                _doc: { _id: '123', username: 'testuser', password: 'hashed', role: 'student' }
            });

            const result = await userService.getUserProfile('123');
            expect(result).toEqual({ _id: '123', username: 'testuser', role: 'student' });
            expect(result.password).toBeUndefined();
        });

        it('should return null if user not found', async () => {
            User.findById.mockResolvedValue(null);
            const result = await userService.getUserProfile('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('creates a user with the given role', async () => {
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ _doc: { _id: '1', username: 'ra1', role: 'academic', academicTitle: 'RES_ASST', password: 'hashed' } });

            const result = await userService.createUser({ username: 'ra1', password: 'secret123', fullName: 'Ad Soyad', role: 'academic', academicTitle: 'RES_ASST' });
            expect(result.role).toBe('academic');
            expect(result.academicTitle).toBe('RES_ASST');
            expect(result.password).toBeUndefined();
        });

        it('throws 409 when the username already exists', async () => {
            User.findOne.mockResolvedValue({ _id: 'x', username: 'ra1' });
            await expect(userService.createUser({ username: 'ra1', password: 'secret123', fullName: 'Ad', role: 'student' }))
                .rejects.toMatchObject({ statusCode: 409 });
            expect(User.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllUsers', () => {
        it('should return users without passwords', async () => {
            const mockFind = { select: jest.fn().mockResolvedValue([{ username: 'a' }, { username: 'b' }]) };
            User.find.mockReturnValue(mockFind);

            const result = await userService.getAllUsers();
            expect(result).toHaveLength(2);
            expect(mockFind.select).toHaveBeenCalledWith('-password');
        });
    });

    describe('updateUser', () => {
        it('should update and return user without password', async () => {
            const mockChain = { select: jest.fn().mockResolvedValue({ _id: '123', fullName: 'Updated Name' }) };
            User.findByIdAndUpdate.mockReturnValue(mockChain);

            const result = await userService.updateUser('123', { fullName: 'Updated Name' });
            expect(result.fullName).toBe('Updated Name');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', { $set: { fullName: 'Updated Name' } }, { new: true });
        });
    });

    describe('deleteUser', () => {
        it('should delete user by id', async () => {
            User.findByIdAndDelete.mockResolvedValue({ _id: '123' });
            await userService.deleteUser('123');
            expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
        });
    });
});
