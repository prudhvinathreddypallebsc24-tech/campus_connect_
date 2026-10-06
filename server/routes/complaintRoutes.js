// complaintRoutes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  getComplaints, getComplaintById, createComplaint, updateStatus, upvoteComplaint
} = require('../controllers/complaintController');

router.get('/',        auth, getComplaints);
router.get('/:id',     auth, getComplaintById);
router.post('/',       auth, createComplaint);
router.patch('/:id/status', auth, role('owner'), updateStatus);
router.post('/:id/upvote',  auth, upvoteComplaint);

module.exports = router;
