const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { updateProfileValidator, changeRoleValidator } = require('../middleware/validators');

// All user routes require authentication
router.use(authenticate);

// ─── CURRENT USER ─────────────────────────────────────────────────────────────

router.get('/me', userController.getMe);
router.patch('/me', updateProfileValidator, userController.updateMe);
router.post('/me/change-password', userController.changePassword);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

router.get('/', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), userController.getUsers);
router.patch('/:id/role', authorize('ADMIN', 'SUPER_ADMIN'), changeRoleValidator, userController.changeRole);
router.patch('/:id/deactivate', authorize('ADMIN', 'SUPER_ADMIN'), userController.deactivateUser);

module.exports = router;
