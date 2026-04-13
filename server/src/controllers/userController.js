const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { audit } = require('../utils/audit');
const { cacheDel } = require('../config/redis');
const config = require('../config');

// ─── SAFE USER SELECT ─────────────────────────────────────────────────────────
// Never expose passwordHash to any response

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  countryCode: true,
  country: true,
  age: true,
  gender: true,
  address: true,
  avatarUrl: true,
  timezone: true,
  theme: true,
  isEmailVerified: true,
  isActive: true,
  role: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  subscription: {
    select: { plan: true, status: true, trialEndsAt: true, currentPeriodEnd: true },
  },
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────

exports.getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: SAFE_USER_SELECT,
  });

  if (!user) throw ApiError.notFound('User not found.');

  res.json({ success: true, data: user });
});

// ─── UPDATE CURRENT USER ──────────────────────────────────────────────────────

exports.updateMe = asyncHandler(async (req, res) => {
  const { fullName, phone, countryCode, country, age, gender, address, timezone, theme, avatarUrl } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(fullName && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(countryCode !== undefined && { countryCode }),
      ...(country !== undefined && { country }),
      ...(age !== undefined && { age: parseInt(age) }),
      ...(gender !== undefined && { gender }),
      ...(address !== undefined && { address }),
      ...(timezone && { timezone }),
      ...(theme && { theme }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: SAFE_USER_SELECT,
  });

  // Bust the auth cache so next request sees fresh data
  await cacheDel(`user:${req.user.id}`);
  await audit({ actorId: req.user.id, action: 'USER_UPDATED', targetType: 'User', targetId: req.user.id, req });

  res.json({ success: true, data: updated });
});

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('currentPassword and newPassword are required.');
  }

  if (newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters.');
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) throw ApiError.badRequest('Current password is incorrect.');

  const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);

  await prisma.$transaction([
    prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } }),
    // Revoke all existing refresh tokens for security
    prisma.refreshToken.updateMany({
      where: { userId: req.user.id },
      data: { isRevoked: true },
    }),
  ]);

  await cacheDel(`user:${req.user.id}`);
  await audit({ actorId: req.user.id, action: 'PASSWORD_CHANGED', req });

  res.json({ success: true, message: 'Password changed. Please log in again.' });
});

// ─── LIST ALL USERS (Admin/Manager only) ─────────────────────────────────────

exports.getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search, isActive } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(role && { role }),
    ...(isActive !== undefined && { isActive: isActive === 'true' }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: SAFE_USER_SELECT,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── CHANGE USER ROLE (Admin only) ────────────────────────────────────────────

exports.changeRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Prevent self-demotion
  if (id === req.user.id) throw ApiError.badRequest('You cannot change your own role.');

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, fullName: true } });
  if (!target) throw ApiError.notFound('User not found.');

  // Only SUPER_ADMIN can create ADMIN
  if (role === 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Only SUPER_ADMIN can assign ADMIN role.');
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: SAFE_USER_SELECT,
  });

  await cacheDel(`user:${id}`);
  await audit({
    actorId: req.user.id,
    action: 'ROLE_CHANGED',
    targetType: 'User',
    targetId: id,
    metadata: { previousRole: target.role, newRole: role },
    req,
  });

  res.json({ success: true, data: updated });
});

// ─── DEACTIVATE USER (Admin only) ─────────────────────────────────────────────

exports.deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) throw ApiError.badRequest('You cannot deactivate your own account.');

  await prisma.user.update({ where: { id }, data: { isActive: false } });

  // Revoke all sessions
  await prisma.refreshToken.updateMany({ where: { userId: id }, data: { isRevoked: true } });
  await cacheDel(`user:${id}`);

  await audit({
    actorId: req.user.id,
    action: 'USER_UPDATED',
    targetType: 'User',
    targetId: id,
    metadata: { action: 'deactivated' },
    req,
  });

  res.json({ success: true, message: 'User deactivated.' });
});
