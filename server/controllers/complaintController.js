// complaintController.js – complaint CRUD + escalation + priority score
// STUDENT MODIFICATION 1: Auto-escalation + priority score computed on every read
const { store } = require('../data/seedData');

// Escalation thresholds (hours)
const ESCALATION_HOURS = {
  Water: 48, Electricity: 48, WiFi: 48,
  Cleaning: 72, Food: 72, Maintenance: 72, Other: 72,
};

// Server is the source of truth for escalation + priority score
function enrichComplaint(c) {
  const hoursOpen = (Date.now() - new Date(c.createdAt).getTime()) / 3600000;
  const daysOpen = hoursOpen / 24;
  const threshold = ESCALATION_HOURS[c.category] || 72;
  const isEscalated = c.status !== 'Resolved' && hoursOpen >= threshold;
  // STUDENT MODIFICATION 1: priority score = upvotes × max(daysOpen,1)
  const priorityScore = Math.round(c.upvotes * Math.max(daysOpen, 1));

  return {
    ...c,
    hoursOpen: Math.round(hoursOpen),
    daysOpen: Math.round(daysOpen * 10) / 10,
    isEscalated,
    escalationThresholdHours: threshold,
    priorityScore,
  };
}

// GET /api/complaints
function getComplaints(req, res) {
  let list = store.complaints.map(enrichComplaint);
  // Sort: escalated first, then by priorityScore desc
  list.sort((a, b) => {
    if (b.isEscalated !== a.isEscalated) return b.isEscalated - a.isEscalated;
    return b.priorityScore - a.priorityScore;
  });
  res.json(list);
}

// GET /api/complaints/:id
function getComplaintById(req, res) {
  const c = store.complaints.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Complaint not found' });
  res.json(enrichComplaint(c));
}

// POST /api/complaints
function createComplaint(req, res) {
  const { roomId, category, title, description, priority } = req.body;
  if (!roomId || !category || !title || !description || !priority) {
    return res.status(400).json({ error: 'Validation failed', details: 'All fields required' });
  }
  if (title.length < 5) return res.status(400).json({ error: 'Title must be at least 5 characters' });
  if (description.length < 10) return res.status(400).json({ error: 'Description must be at least 10 characters' });

  const newC = {
    id: `c${++store.nextId}`,
    roomId, category, title, description, priority,
    tenantId: req.user.id,
    tenantName: req.user.name,
    status: 'Open',
    createdAt: Date.now(),
    resolvedAt: null,
    ownerNote: '',
    upvotes: 0,
    upvotedBy: [],
  };
  store.complaints.push(newC);
  res.status(201).json(enrichComplaint(newC));
}

// PATCH /api/complaints/:id/status  (owner only)
function updateStatus(req, res) {
  const c = store.complaints.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Complaint not found' });

  const { status, ownerNote } = req.body;
  const validStatuses = ['Open', 'In Progress', 'Resolved'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status', details: validStatuses.join(', ') });
  }
  if (status) c.status = status;
  if (status === 'Resolved' && !c.resolvedAt) c.resolvedAt = Date.now();
  if (ownerNote !== undefined) c.ownerNote = ownerNote;

  res.json(enrichComplaint(c));
}

// POST /api/complaints/:id/upvote
function upvoteComplaint(req, res) {
  const c = store.complaints.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Complaint not found' });
  if (c.upvotedBy.includes(req.user.id)) {
    return res.status(400).json({ error: 'Already upvoted' });
  }
  c.upvotes += 1;
  c.upvotedBy.push(req.user.id);
  res.json(enrichComplaint(c));
}

module.exports = { getComplaints, getComplaintById, createComplaint, updateStatus, upvoteComplaint };
