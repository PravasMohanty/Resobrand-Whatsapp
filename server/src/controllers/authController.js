const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma/client');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { audit } = require('../utils/audit');
const {
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail,
} = require('../utils/email');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');
const config = require('../config');

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const REFRESH_TOKEN_TTL_DAYS = 7;

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};

const buildUserPayload = (user) => ({
  userId: user.id,
  email: user.email,
  role: user.role,
  plan: user.subscription?.plan || 'FREE',
});

// ─── REGISTER ─────────────────────────────────────────────────────────────────

exports.register = asyncHandler(async (req, res) => {
  const { email, password, fullName, phone, countryCode, country, age, gender, address } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.conflict('An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

  // Wrap user + subscription creation in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        countryCode: countryCode || '+91',
        country: country || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        address: address || null,
      },
    });

    // Create trial subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + config.trialDays);

    await tx.subscription.create({
      data: {
        userId: newUser.id,
        plan: 'FREE',
        status: 'TRIAL',
        trialEndsAt: trialEnd,
      },
    });

    // Email verification token (expires 24h)
    const verifyToken = uuidv4();
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await tx.emailVerification.create({
      data: { token: verifyToken, userId: newUser.id, expiresAt: verifyExpiry },
    });

    return { user: newUser, verifyToken };
  });

  // Send emails (non-blocking)
  const verifyLink = `${config.urls.emailVerify}?token=${user.verifyToken}`;
  sendEmailVerification(email, fullName, verifyLink).catch(() => {});
  sendWelcomeEmail(email, fullName).catch(() => {});

  await audit({ actorId: user.user.id, action: 'USER_REGISTERED', req });

  res.status(201).json({
    success: true,
    message: 'Account created. Please check your email to verify your account.',
    data: {
      id: user.user.id,
      email: user.user.email,
      fullName: user.user.fullName,
    },
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: { select: { plan: true, status: true } } },
  });

  if (!user) throw ApiError.unauthorized('Invalid email or password.');

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) throw ApiError.unauthorized('Invalid email or password.');

  if (!user.isActive) throw ApiError.unauthorized('Your account has been deactivated. Contact support.');

  const payload = buildUserPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshTokenStr = signRefreshToken(payload);

  // Persist refresh token in DB
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenStr,
      userId: user.id,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  });

  setRefreshCookie(res, refreshTokenStr);
  await audit({ actorId: user.id, action: 'USER_LOGIN', req });

  res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
        plan: user.subscription?.plan || 'FREE',
        subscriptionStatus: user.subscription?.status || 'TRIAL',
      },
    },
  });
});

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw ApiError.unauthorized('No refresh token provided.');

  // Verify signature first
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token.');
  }

  // Check DB – token must exist and not be revoked
  const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token is invalid or has been revoked.');
  }

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { isRevoked: true } });

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { subscription: { select: { plan: true } } },
  });

  if (!user || !user.isActive) throw ApiError.unauthorized('User not found or inactive.');

  const payload = buildUserPayload(user);
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  });

  setRefreshCookie(res, newRefreshToken);

  res.json({ success: true, data: { accessToken: newAccessToken } });
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (token) {
    await prisma.refreshToken
      .updateMany({ where: { token }, data: { isRevoked: true } })
      .catch(() => {});
  }

  // Invalidate user cache
  if (req.user) await cacheDel(`user:${req.user.id}`);

  clearRefreshCookie(res);
  await audit({ actorId: req.user?.id, action: 'USER_LOGOUT', req });

  res.json({ success: true, message: 'Logged out successfully.' });
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration attacks
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
    });
  }

  // Invalidate any existing reset tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, isUsed: false },
    data: { isUsed: true },
  });

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.passwordReset.create({
    data: { token, userId: user.id, expiresAt },
  });

  const resetLink = `${config.urls.passwordReset}?token=${token}`;
  sendPasswordResetEmail(email, user.fullName, resetLink).catch(() => {});

  await audit({ actorId: user.id, action: 'PASSWORD_RESET_REQUESTED', req });

  res.json({
    success: true,
    message: 'If that email exists, a reset link has been sent.',
  });
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

  if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
    throw ApiError.badRequest('This reset link is invalid or has expired.');
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    }),
    // Revoke all refresh tokens for security
    prisma.refreshToken.updateMany({
      where: { userId: resetRecord.userId },
      data: { isRevoked: true },
    }),
  ]);

  await cacheDel(`user:${resetRecord.userId}`);
  await audit({ actorId: resetRecord.userId, action: 'PASSWORD_RESET_COMPLETED', req });

  res.json({ success: true, message: 'Password reset successfully. Please log in.' });
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw ApiError.badRequest('Verification token is required.');

  const record = await prisma.emailVerification.findUnique({ where: { token } });

  if (!record || record.isUsed || record.expiresAt < new Date()) {
    throw ApiError.badRequest('This verification link is invalid or has expired.');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    }),
    prisma.emailVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    }),
  ]);

  await cacheDel(`user:${record.userId}`);

  res.json({ success: true, message: 'Email verified successfully.' });
});
