const router = require('express').Router();
const auditController = require('../controllers/auditController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/', auditController.getLogs);
router.get('/:id', auditController.getLog);

module.exports = router;
