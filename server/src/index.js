require('dotenv').config();

const express = require('express');

const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { setupApp } = require('./utils/appSetup');

// ─── ROUTE IMPORTS ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const auditRoutes = require('./routes/audit.routes');
const subscriptionRoutes = require('./routes/subscription.routes');

// ─── APP SETUP ────────────────────────────────────────────────────────────────
const app = express();
setupApp(app);

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

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
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

if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down...');
  await require('./prisma/client').$disconnect();
  process.exit(0);
});

module.exports = app;

