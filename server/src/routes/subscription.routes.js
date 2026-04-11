const router = require('express').Router();
const subController = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/authenticate');

// Public
router.get('/plans', subController.getPlans);

// Protected
router.use(authenticate);
router.get('/my', subController.getSubscription);
router.post('/order', subController.createOrder);
router.post('/cancel', subController.cancelSubscription);

module.exports = router;
