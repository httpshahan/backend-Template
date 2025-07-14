const User = require('../models/User');

describe('User Model', () => {
  let testUser;

  beforeAll(async() => {
    // Clean up any existing test users
    await User.destroy({ where: { email: 'model-test@example.com' }, force: true });
  });

  afterAll(async() => {
    // Clean up test user
    if (testUser) {
      await testUser.destroy({ force: true });
    }
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async() => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'model-test@example.com',
        password: 'Test@123',
        role: 'user'
      };

      testUser = await User.create(userData);

      expect(testUser.id).toBeDefined();
      expect(testUser.firstName).toBe(userData.firstName);
      expect(testUser.lastName).toBe(userData.lastName);
      expect(testUser.email).toBe(userData.email);
      expect(testUser.role).toBe(userData.role);
      expect(testUser.isActive).toBe(true);
      expect(testUser.emailVerified).toBe(false);

      // Password should be hashed
      expect(testUser.password).not.toBe(userData.password);
      expect(testUser.password.length).toBeGreaterThan(50);
    });

    it('should not create user with invalid email', async() => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Test@123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create user with duplicate email', async() => {
      const userData = {
        firstName: 'Another',
        lastName: 'User',
        email: 'model-test@example.com',
        password: 'Test@123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create user with invalid role', async() => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test-role@example.com',
        password: 'Test@123',
        role: 'invalid-role'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async() => {
      const correctPassword = 'Test@123';
      const wrongPassword = 'Wrong@123';

      const isCorrect = await testUser.comparePassword(correctPassword);
      const isWrong = await testUser.comparePassword(wrongPassword);

      expect(isCorrect).toBe(true);
      expect(isWrong).toBe(false);
    });

    it('should return full name', () => {
      const fullName = testUser.getFullName();
      expect(fullName).toBe('Test User');
    });

    it('should return JSON without sensitive fields', () => {
      const userJSON = testUser.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.emailVerificationToken).toBeUndefined();
      expect(userJSON.passwordResetToken).toBeUndefined();
      expect(userJSON.passwordResetExpires).toBeUndefined();

      expect(userJSON.firstName).toBeDefined();
      expect(userJSON.email).toBeDefined();
    });
  });

  describe('User Class Methods', () => {
    it('should find user by email', async() => {
      const foundUser = await User.findByEmail('model-test@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('model-test@example.com');
    });

    it('should return null for non-existent email', async() => {
      const foundUser = await User.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });

    it('should find active users', async() => {
      const activeUsers = await User.findActiveUsers();

      expect(Array.isArray(activeUsers)).toBe(true);
      activeUsers.forEach(user => {
        expect(user.isActive).toBe(true);
      });
    });
  });

  describe('User Updates', () => {
    it('should update user data', async() => {
      const updateData = {
        firstName: 'Updated',
        phone: '+1234567890'
      };

      await testUser.update(updateData);

      expect(testUser.firstName).toBe(updateData.firstName);
      expect(testUser.phone).toBe(updateData.phone);
    });

    it('should hash password on update', async() => {
      const newPassword = 'NewPassword@123';
      const oldPasswordHash = testUser.password;

      await testUser.update({ password: newPassword });

      expect(testUser.password).not.toBe(newPassword);
      expect(testUser.password).not.toBe(oldPasswordHash);

      // Should be able to login with new password
      const isValid = await testUser.comparePassword(newPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('User Soft Delete', () => {
    it('should soft delete user', async() => {
      await testUser.destroy();

      // User should still exist in database but with deletedAt timestamp
      const deletedUser = await User.findByPk(testUser.id, { paranoid: false });
      expect(deletedUser).toBeDefined();
      expect(deletedUser.deletedAt).toBeDefined();

      // Should not be found with normal query
      const foundUser = await User.findByPk(testUser.id);
      expect(foundUser).toBeNull();
    });
  });
});
