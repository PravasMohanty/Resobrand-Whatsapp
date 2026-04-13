const prisma = require('../prisma/client');
const logger = require('./logger');

/**
 * Write an audit log entry.
 * Fire-and-forget – never throws, so it never breaks the main request.
 */
const audit = async ({ actorId, action, targetType, targetId, metadata, req }) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action,
        targetType: targetType || null,
        targetId: targetId || null,
        metadata: metadata || undefined,
        ipAddress: req?.ip || null,
        userAgent: req?.headers?.['user-agent'] || null,
      },
    });
  } catch (err) {
    logger.error('Audit log write failed', { action, error: err.message });
  }
};

module.exports = { audit };
