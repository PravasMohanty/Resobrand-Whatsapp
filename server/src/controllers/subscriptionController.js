const crypto = require('crypto');
const prisma = require('../prisma/client');
const { ApiError, asyncHandler } = require('../utils/apiError');
const { audit } = require('../utils/audit');
const { cacheDel } = require('../config/redis');
const config = require('../config');
const logger = require('../utils/logger');

// ─── GET CURRENT SUBSCRIPTION ─────────────────────────────────────────────────

exports.getSubscription = asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  const planConfig = await prisma.planConfig.findUnique({
    where: { plan: subscription?.plan || 'FREE' },
  });

  res.json({ success: true, data: { subscription, planConfig } });
});

// ─── GET ALL PLAN CONFIGS ─────────────────────────────────────────────────────

exports.getPlans = asyncHandler(async (req, res) => {
  const plans = await prisma.planConfig.findMany({ orderBy: { priceMonthly: 'asc' } });
  res.json({ success: true, data: plans });
});

// ─── CREATE RAZORPAY ORDER (for subscription upgrade) ────────────────────────

exports.createOrder = asyncHandler(async (req, res) => {
  const { plan, billingCycle = 'monthly' } = req.body;

  if (!['BUSINESS', 'ENTERPRISE'].includes(plan)) {
    throw ApiError.badRequest('Invalid plan. Choose BUSINESS or ENTERPRISE.');
  }

  const planConfig = await prisma.planConfig.findUnique({ where: { plan } });
  if (!planConfig) throw ApiError.notFound('Plan configuration not found.');

  const amount = billingCycle === 'yearly' ? planConfig.priceYearly : planConfig.priceMonthly;

  // NOTE: Install razorpay package when enabling: npm install razorpay
  // const Razorpay = require('razorpay');
  // const razorpay = new Razorpay({ key_id: config.razorpay.keyId, key_secret: config.razorpay.keySecret });
  // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: `order_${req.user.id}` });

  // Stub response until Razorpay is enabled
  const order = {
    id: `order_stub_${Date.now()}`,
    amount: amount * 100,
    currency: 'INR',
    status: 'created',
  };

  res.json({
    success: true,
    data: {
      order,
      keyId: config.razorpay.keyId,
      plan,
      billingCycle,
      amountINR: amount,
    },
  });
});

// ─── RAZORPAY WEBHOOK ─────────────────────────────────────────────────────────
// POST /api/webhooks/razorpay  (no auth – validated by signature)

exports.razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = req.rawBody; // requires express to store rawBody (configured in index.js)

  if (!signature || !body) {
    return res.status(400).json({ success: false, message: 'Missing signature or body.' });
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.warn('Razorpay webhook signature mismatch');
    return res.status(400).json({ success: false, message: 'Invalid signature.' });
  }

  const event = JSON.parse(body);

  // Persist raw event for idempotency / debugging
  const paymentEvent = await prisma.paymentEvent.create({
    data: {
      provider: 'razorpay',
      eventType: event.event,
      externalId: event.payload?.payment?.entity?.id || event.payload?.subscription?.entity?.id || '',
      payload: event,
    },
  });

  try {
    await handleRazorpayEvent(event);
    await prisma.paymentEvent.update({
      where: { id: paymentEvent.id },
      data: { processed: true, processedAt: new Date() },
    });
  } catch (err) {
    logger.error('Razorpay webhook processing failed', { event: event.event, error: err.message });
  }

  // Always return 200 to Razorpay to prevent retries on our side
  res.json({ success: true });
});

// ─── WEBHOOK EVENT ROUTER ─────────────────────────────────────────────────────

async function handleRazorpayEvent(event) {
  const entity = event.payload?.subscription?.entity || event.payload?.payment?.entity;

  switch (event.event) {
    case 'subscription.activated': {
      // Find user by razorpay customer id or notes
      const razorpaySubId = entity?.id;
      const userId = entity?.notes?.userId;
      if (!userId) break;

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          status: 'ACTIVE',
          razorpaySubId,
          currentPeriodStart: new Date(entity.current_start * 1000),
          currentPeriodEnd: new Date(entity.current_end * 1000),
        },
        create: {
          userId,
          plan: 'BUSINESS', // derive from plan id mapping
          status: 'ACTIVE',
          razorpaySubId,
        },
      });

      await cacheDel(`user:${userId}`);
      await audit({ actorId: userId, action: 'PLAN_UPGRADED', metadata: { razorpaySubId } });
      break;
    }

    case 'subscription.cancelled': {
      const userId = entity?.notes?.userId;
      if (!userId) break;

      await prisma.subscription.update({
        where: { userId },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      });

      await cacheDel(`user:${userId}`);
      await audit({ actorId: userId, action: 'SUBSCRIPTION_CANCELLED' });
      break;
    }

    case 'payment.failed': {
      const userId = entity?.notes?.userId;
      if (!userId) break;

      await prisma.subscription.update({
        where: { userId },
        data: { status: 'PAST_DUE' },
      });
      await cacheDel(`user:${userId}`);
      break;
    }

    default:
      logger.info(`Unhandled Razorpay event: ${event.event}`);
  }
}

// ─── CANCEL SUBSCRIPTION ──────────────────────────────────────────────────────

exports.cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({ where: { userId: req.user.id } });

  if (!subscription || subscription.status === 'CANCELLED') {
    throw ApiError.badRequest('No active subscription to cancel.');
  }

  // NOTE: Call razorpay.subscriptions.cancel(subscription.razorpaySubId) when enabled

  await prisma.subscription.update({
    where: { userId: req.user.id },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  });

  await cacheDel(`user:${req.user.id}`);
  await audit({ actorId: req.user.id, action: 'SUBSCRIPTION_CANCELLED', req });

  res.json({ success: true, message: 'Subscription cancelled.' });
});
