const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Sign a short-lived access token
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: 'resobrand',
  });
};

/**
 * Sign a long-lived refresh token
 */
const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'resobrand',
  });
};

/**
 * Verify access token – throws if invalid/expired
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret, { issuer: 'resobrand' });
};

/**
 * Verify refresh token – throws if invalid/expired
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret, { issuer: 'resobrand' });
};

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
