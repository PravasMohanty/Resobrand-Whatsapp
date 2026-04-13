const { signAccessToken, signRefreshToken } = require('./jwt');
const config = require('../config');

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

const createTokens = (user) => {
  const payload = buildUserPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
};

module.exports = {
  REFRESH_TOKEN_TTL_DAYS,
  setRefreshCookie,
  clearRefreshCookie,
  buildUserPayload,
  createTokens,
};