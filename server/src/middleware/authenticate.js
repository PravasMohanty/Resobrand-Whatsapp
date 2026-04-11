const { verifyAccessToken } = require('../utils/jwt');
const { ApiError } = require('../utils/apiError');
const prisma = require('../prisma/client');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * Extracts JWT from Authorization header or cookie and attaches req.user
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) throw ApiError.unauthorized('No token provided');

    const decoded = verifyAccessToken(token);

    // Try cache first to reduce DB hits
    const cacheKey = `user:${decoded.userId}`;
    let user = await cacheGet(cacheKey);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          organizationId: true,
          subscription: { select: { plan: true, status: true } },
        },
      });

      if (user) await cacheSet(cacheKey, user, 300); // cache 5 min
    }

    if (!user) throw ApiError.unauthorized('User not found');
    if (!user.isActive) throw ApiError.unauthorized('Account deactivated');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(ApiError.unauthorized('Token expired'));
    if (err.name === 'JsonWebTokenError') return next(ApiError.unauthorized('Invalid token'));
    next(err);
  }
};

/**
 * Optional auth – attaches req.user if token present, but doesn't block if not
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  return authenticate(req, res, next);
};

module.exports = { authenticate, optionalAuth };
