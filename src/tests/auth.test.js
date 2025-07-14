const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Clean up test user if exists
    await User.destroy({ where: { email: 'test@example.com' }, force: true });
  });

  afterAll(async () => {
    // Clean up test user
    await User.destroy({ where: { email: 'test@example.com' }, force: true });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test@123'
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.token).toBeDefined();

      // Store token for other tests
      authToken = res.body.data.token;
    });

    it('should not register user with existing email', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test@123'
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Test@123'
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should not register user with weak password', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test2@example.com',
        password: '123'
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test@123'
      };

      const res = await request(app).post('/api/v1/auth/login').send(loginData).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(loginData.email);
      expect(res.body.data.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app).post('/api/v1/auth/login').send(loginData).expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Test@123'
      };

      const res = await request(app).post('/api/v1/auth/login').send(loginData).expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should not get profile without token', async () => {
      const res = await request(app).get('/api/v1/auth/profile').expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/auth/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1234567890'
      };

      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe(updateData.firstName);
      expect(res.body.data.user.lastName).toBe(updateData.lastName);
      expect(res.body.data.user.phone).toBe(updateData.phone);
    });

    it('should not update profile with invalid data', async () => {
      const updateData = {
        firstName: 'A', // Too short
        phone: 'invalid-phone'
      };

      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });
});
