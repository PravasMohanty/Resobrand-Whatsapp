require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ─── ROUTE IMPORTS ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const auditRoutes = require('./routes/audit.routes');
const subscriptionRoutes = require('./routes/subscription.routes');

// ─── APP SETUP ────────────────────────────────────────────────────────────────
const app = express();

// Trust proxy (needed for correct req.ip behind Nginx/load balancer)
app.set('trust proxy', 1);

// ─── SECURITY ─────────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global rate limit – generous, specific routes have tighter limits
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Rate limit exceeded. Please slow down.' },
  })
);

// ─── RAZORPAY WEBHOOK (needs raw body BEFORE json parser) ─────────────────────
app.post(
  '/api/webhooks/razorpay',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body.toString();
    next();
  },
  require('./controllers/subscriptionController').razorpayWebhook
);

// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ─── LOGGING ──────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.http(msg.trim()) },
      skip: (req) => req.path === '/api/health',
    })
  );
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Placeholder stubs so frontend integration doesn't 404
// (Other members will fill these in)
const stubRouter = (req, res) =>
  res.status(501).json({ success: false, message: 'Not implemented yet.' });

app.use('/api/leads', stubRouter);
app.use('/api/contacts', stubRouter);
app.use('/api/campaigns', stubRouter);
app.use('/api/templates', stubRouter);
app.use('/api/conversations', stubRouter);
app.use('/api/segments', stubRouter);
app.use('/api/automations', stubRouter);
app.use('/api/analytics', stubRouter);
app.use('/api/integrations', stubRouter);

// ─── ERROR HANDLERS ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── START ────────────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Test DB connection
    const prisma = require('./prisma/client');
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
      logger.info(`Client origin: ${config.clientUrl}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down...');
  await require('./prisma/client').$disconnect();
  process.exit(0);
});

module.exports = app; // exported for testing
