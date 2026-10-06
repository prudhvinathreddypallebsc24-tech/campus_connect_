// absenceController.js – tenant marks days away
// STUDENT MODIFICATION 2: records absence for bill-split calculation
const { store } = require('../data/seedData');

// POST /api/absences
function markAbsence(req, res) {
  const { month, daysAway } = req.body;
  if (!month || daysAway === undefined) {
    return res.status(400).json({ error: 'month and daysAway required' });
  }
  const d = new Date(month + '-01');
  const totalDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (daysAway < 0 || daysAway > totalDays) {
    return res.status(400).json({ error: `daysAway must be 0-${totalDays}` });
  }
  // Upsert
  let existing = store.absences.find(a => a.tenantId === req.user.id && a.month === month);
  if (existing) {
    existing.daysAway = daysAway;
    existing.totalDays = totalDays;
    return res.json(existing);
  }
  const newAbsence = {
    id: `a${++store.nextId}`,
    tenantId: req.user.id,
    month, totalDays, daysAway,
  };
  store.absences.push(newAbsence);
  res.status(201).json(newAbsence);
}

// GET /api/absences
function getAbsences(req, res) {
  if (req.user.role === 'owner') {
    res.json(store.absences);
  } else {
    res.json(store.absences.filter(a => a.tenantId === req.user.id));
  }
}

module.exports = { markAbsence, getAbsences };
