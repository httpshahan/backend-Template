const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Mount routes with their respective prefixes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// API information route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Template API',
    version: '1.0.0',
    endpoints: {
      auth: {
        base: '/auth',
        routes: [
          'POST /auth/register',
          'POST /auth/login',
          'POST /auth/logout',
          'POST /auth/refresh-token',
          'POST /auth/forgot-password',
          'POST /auth/reset-password',
          'GET /auth/profile',
          'PUT /auth/profile',
          'PUT /auth/change-password'
        ]
      },
      users: {
        base: '/users',
        routes: [
          'GET /users (admin)',
          'GET /users/search',
          'GET /users/:id',
          'PUT /users/:id (admin)',
          'DELETE /users/:id (admin)',
          'PUT /users/:id/role (admin)'
        ]
      }
    },
    documentation: {
      guides: '/docs/guides/',
      reference: '/docs/reference/api-documentation.md'
    }
  });
});

module.exports = router;
