// absenceRoutes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { markAbsence, getAbsences } = require('../controllers/absenceController');

router.post('/',  auth, markAbsence);
router.get('/',   auth, getAbsences);

module.exports = router;
