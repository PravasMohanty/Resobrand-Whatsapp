require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'no-reply@resobrand.com',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  urls: {
    passwordReset: process.env.PASSWORD_RESET_URL || 'http://localhost:5173/#/reset-password',
    emailVerify: process.env.EMAIL_VERIFY_URL || 'http://localhost:5173/#/verify-email',
  },

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  trialDays: parseInt(process.env.TRIAL_DAYS) || 14,
};

// Guard: crash fast if critical secrets are missing in production
if (config.nodeEnv === 'production') {
  const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
  required.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  });
}

module.exports = config;
