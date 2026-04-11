const prisma = require('../prisma/client');
const { asyncHandler } = require('../utils/apiError');

// ─── LIST AUDIT LOGS (Admin only) ─────────────────────────────────────────────

exports.getLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, actorId, action, targetType, targetId, from, to } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(actorId && { actorId }),
    ...(action && { action }),
    ...(targetType && { targetType }),
    ...(targetId && { targetId }),
    ...(from || to
      ? {
          createdAt: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({
    success: true,
    data: logs,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── GET SINGLE LOG ───────────────────────────────────────────────────────────

exports.getLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      actor: { select: { id: true, fullName: true, email: true, role: true } },
    },
  });

  if (!log) throw require('../utils/apiError').ApiError.notFound('Audit log not found.');

  res.json({ success: true, data: log });
});
