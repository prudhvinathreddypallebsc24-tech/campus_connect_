// billRoutes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { getBills, getMyShare, createBill, updatePayment } = require('../controllers/billController');

router.get('/',           auth, getBills);
router.get('/my-share',   auth, getMyShare);
router.post('/',          auth, role('owner'), createBill);
router.patch('/:id/payment', auth, role('owner'), updatePayment);

module.exports = router;
