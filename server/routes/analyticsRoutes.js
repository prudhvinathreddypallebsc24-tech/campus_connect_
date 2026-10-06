// analyticsRoutes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', auth, role('owner'), getAnalytics);

module.exports = router;
