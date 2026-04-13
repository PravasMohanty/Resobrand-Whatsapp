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

module.exports = {
  SAFE_USER_SELECT,
};