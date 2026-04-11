const { validationResult, body, param, query } = require('express-validator');
const { ApiError } = require('../utils/apiError');

/**
 * Runs after validator chains – returns 400 if any errors exist
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(ApiError.badRequest('Validation failed', formatted));
  }
  next();
};

// ─── AUTH VALIDATORS ──────────────────────────────────────────────────────────

const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('countryCode').optional().matches(/^\+\d+/).withMessage('Invalid country code'),
  validate,
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  validate,
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  validate,
];

// ─── USER VALIDATORS ──────────────────────────────────────────────────────────

const updateProfileValidator = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().isMobilePhone(),
  body('timezone').optional().isString(),
  body('theme').optional().isIn(['light', 'dark']),
  validate,
];

const changeRoleValidator = [
  param('id').isUUID().withMessage('Invalid user ID'),
  body('role').isIn(['ADMIN', 'MANAGER', 'AGENT']).withMessage('Invalid role'),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
  changeRoleValidator,
};
