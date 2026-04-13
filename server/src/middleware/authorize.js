const { ApiError } = require('../utils/apiError');

// Role hierarchy: higher index = more permissions
const ROLE_LEVELS = {
  AGENT: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Middleware factory – allows only specified roles
 * Usage: authorize('ADMIN', 'SUPER_ADMIN')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());

    const userLevel = ROLE_LEVELS[req.user.role] || 0;
    const minLevel = Math.min(...allowedRoles.map((r) => ROLE_LEVELS[r] || 99));

    if (userLevel < minLevel) {
      return next(
        ApiError.forbidden(
          `This action requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

/**
 * Middleware factory – checks plan feature entitlement
 * Usage: requireFeature('canUseAI')
 */
const requireFeature = (feature) => {
  return async (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());

    const planConfig = await require('../prisma/client').planConfig.findUnique({
      where: { plan: req.user.subscription?.plan || 'FREE' },
    });

    if (!planConfig || !planConfig[feature]) {
      return next(
        ApiError.forbidden(
          `Your current plan does not include this feature. Please upgrade to access "${feature}".`
        )
      );
    }

    req.planConfig = planConfig;
    next();
  };
};

/**
 * Middleware factory – checks if user has remaining message quota
 */
const requireMessageQuota = async (req, res, next) => {
  // This is a stub – actual usage count should come from analytics service
  // Member 6 will hook in usage tracking; this middleware checks the limit
  const plan = req.user?.subscription?.plan || 'FREE';
  const planConfig = await require('../prisma/client').planConfig.findUnique({
    where: { plan },
  });

  if (planConfig && planConfig.maxMessages !== -1) {
    // TODO: integrate with analytics to check actual usage
    // For now, attach plan limits to req for campaign service to validate
    req.planConfig = planConfig;
  }

  next();
};

module.exports = { authorize, requireFeature, requireMessageQuota };
