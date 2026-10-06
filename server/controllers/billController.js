// billController.js – bills + days-present bill share
// STUDENT MODIFICATION 2: Days-present bill splitting formula on read
const { store } = require('../data/seedData');

// Compute tenant's share of shared utility bill
// Formula: totalSharedBill / totalPersonDays * tenantDaysPresent
function computeUtilityShare(tenantId, month) {
  const { totalSharedBill } = store.sharedBill;
  const absences = store.absences.filter(a => a.month === month);

  // Total person-days across ALL tenants for the month
  let totalPersonDays = 0;
  absences.forEach(a => {
    const present = a.totalDays - a.daysAway;
    totalPersonDays += present;
  });
  if (totalPersonDays === 0) return 0; // guard division by zero

  const myAbsence = absences.find(a => a.tenantId === tenantId);
  if (!myAbsence) return 0;
  const daysPresent = myAbsence.totalDays - myAbsence.daysAway;
  // STUDENT MODIFICATION 2: bill share formula
  return Math.round((totalSharedBill / totalPersonDays) * daysPresent);
}

// GET /api/bills
function getBills(req, res) {
  let bills;
  if (req.user.role === 'owner') {
    bills = store.bills;
  } else {
    bills = store.bills.filter(b => b.tenantId === req.user.id);
  }
  // Enrich with utility share
  const enriched = bills.map(b => {
    const share = computeUtilityShare(b.tenantId, b.month);
    const total = b.baseRent + share;
    const pending = total - b.amountPaid;
    return { ...b, utilityShare: share, totalAmount: total, amountPending: Math.max(0, pending) };
  });
  res.json(enriched);
}

// GET /api/bills/my-share (tenant view with formula details)
function getMyShare(req, res) {
  const { totalSharedBill, month } = store.sharedBill;
  const absences = store.absences.filter(a => a.month === month);
  let totalPersonDays = 0;
  absences.forEach(a => { totalPersonDays += (a.totalDays - a.daysAway); });

  const myAbsence = absences.find(a => a.tenantId === req.user.id);
  const daysPresent = myAbsence ? myAbsence.totalDays - myAbsence.daysAway : 0;
  const daysAway = myAbsence ? myAbsence.daysAway : 0;
  const totalDays = myAbsence ? myAbsence.totalDays : 0;
  const share = totalPersonDays > 0 ? Math.round((totalSharedBill / totalPersonDays) * daysPresent) : 0;

  res.json({
    month, totalSharedBill, totalPersonDays, daysPresent, daysAway, totalDays,
    myUtilityShare: share,
    formula: `${totalSharedBill} / ${totalPersonDays} × ${daysPresent} = ₹${share}`,
  });
}

// POST /api/bills (owner only)
function createBill(req, res) {
  const { tenantId, month, baseRent } = req.body;
  if (!tenantId || !month || baseRent === undefined) {
    return res.status(400).json({ error: 'Validation failed', details: 'tenantId, month, baseRent required' });
  }
  const tenant = store.users.find(u => u.id === tenantId);
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  const newBill = {
    id: `b${++store.nextId}`,
    tenantId, tenantName: tenant.name,
    roomId: tenant.roomId,
    month, baseRent, utilityShare: 0,
    totalAmount: baseRent,
    amountPaid: 0,
    status: 'Pending',
    paymentDate: null,
  };
  store.bills.push(newBill);
  res.status(201).json(newBill);
}

// PATCH /api/bills/:id/payment (owner only)
function updatePayment(req, res) {
  const bill = store.bills.find(b => b.id === req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });

  const { amountPaid } = req.body;
  if (amountPaid === undefined || amountPaid < 0) {
    return res.status(400).json({ error: 'Invalid amountPaid' });
  }
  bill.amountPaid = amountPaid;
  const share = computeUtilityShare(bill.tenantId, bill.month);
  const total = bill.baseRent + share;
  bill.utilityShare = share;
  bill.totalAmount = total;
  if (amountPaid >= total) bill.status = 'Paid';
  else if (amountPaid > 0) bill.status = 'Partially Paid';
  else bill.status = 'Pending';
  if (amountPaid > 0) bill.paymentDate = new Date().toISOString();
  res.json({ ...bill, amountPending: Math.max(0, total - amountPaid) });
}

module.exports = { getBills, getMyShare, createBill, updatePayment };
