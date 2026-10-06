// roomRoutes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getRooms, getRoomById } = require('../controllers/roomController');

router.get('/', auth, getRooms);
router.get('/:id', auth, getRoomById);

module.exports = router;
