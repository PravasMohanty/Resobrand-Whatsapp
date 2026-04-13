const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../middleware/validators');
const rateLimit = require('express-rate-limit');

// ─── RATE LIMITERS ────────────────────────────────────────────────────────────

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many password reset attempts. Try again in an hour.' },
});

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
