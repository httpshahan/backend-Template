const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { updateUserValidation, updateUserRoleValidation } = require('../validators/userValidators');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Routes accessible by authenticated users
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUserById);

// Admin only routes
router.use(adminMiddleware); // Apply admin middleware to routes below

router.get('/', UserController.getAllUsers);
router.put('/:id', updateUserValidation, UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.get('/stats/overview', UserController.getUserStats);
router.patch('/:id/toggle-status', UserController.toggleUserStatus);
router.patch('/:id/role', updateUserRoleValidation, UserController.updateUserRole);

module.exports = router;
