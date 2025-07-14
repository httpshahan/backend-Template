const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validators/authValidators');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.post('/forgot-password', forgotPasswordValidation, AuthController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/verify-email/:verificationToken', AuthController.verifyEmail);

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below

router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.getProfile);
router.put('/profile', updateProfileValidation, AuthController.updateProfile);
router.put('/change-password', changePasswordValidation, AuthController.changePassword);

module.exports = router;
