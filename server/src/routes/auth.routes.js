const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../middleware/validators');
const { authLimiter, forgotPasswordLimiter } = require('../utils/rateLimiters');

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);

// ─── PROTECTED ROUTES ─────────────────────────────────────────────────────────

router.post('/logout', authenticate, authController.logout);

module.exports = router;
