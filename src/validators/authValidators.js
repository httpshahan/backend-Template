const { body } = require('express-validator');

// Register validation
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(value => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        throw new Error('You must be at least 13 years old to register');
      }

      if (age > 120) {
        throw new Error('Please provide a valid date of birth');
      }

      return true;
    })
];

// Login validation
const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required')
];

// Update profile validation
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(value => {
      if (!value) {
        return true;
      } // Skip validation if value is empty

      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        throw new Error('You must be at least 13 years old');
      }

      if (age > 120) {
        throw new Error('Please provide a valid date of birth');
      }

      return true;
    }),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
];

// Change password validation
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail()
];

// Reset password validation
const resetPasswordValidation = [
  body('resetToken').notEmpty().withMessage('Reset token is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};
