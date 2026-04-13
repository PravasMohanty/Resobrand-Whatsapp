const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  // Operational errors (known, expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors?.length ? err.errors : undefined,
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  // JWT errors (should be caught in middleware, but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  // Unknown / programming errors – don't leak stack in prod
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again later.'
        : err.message,
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFoundHandler };
