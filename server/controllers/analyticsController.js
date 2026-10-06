// analyticsController.js – owner-only analytics summary
const { store } = require('../data/seedData');

function getAnalytics(req, res) {
  const complaints = store.complaints;
  const bills = store.bills;
  const rooms = store.rooms;

  // Complaint stats
  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'Open').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  // Escalation (recompute)
  const now = Date.now();
  const ESCALATION_HOURS = { Water:48, Electricity:48, WiFi:48, Cleaning:72, Food:72, Maintenance:72, Other:72 };
  const escalated = complaints.filter(c => {
    if (c.status === 'Resolved') return false;
    const hrs = (now - new Date(c.createdAt).getTime()) / 3600000;
    return hrs >= (ESCALATION_HOURS[c.category] || 72);
  }).length;

  // Average resolution time (hours)
  const resolvedList = complaints.filter(c => c.status === 'Resolved' && c.resolvedAt);
  const avgResolutionHrs = resolvedList.length
    ? Math.round(resolvedList.reduce((sum, c) => sum + (new Date(c.resolvedAt) - new Date(c.createdAt)) / 3600000, 0) / resolvedList.length)
    : 0;

  // By category
  const categories = ['Water','Electricity','WiFi','Cleaning','Food','Maintenance','Other'];
  const byCategory = {};
  categories.forEach(cat => { byCategory[cat] = complaints.filter(c => c.category === cat).length; });

  // Billing stats
  const totalExpected = bills.reduce((s, b) => s + b.totalAmount, 0);
  const totalCollected = bills.reduce((s, b) => s + b.amountPaid, 0);
  const totalPending = totalExpected - totalCollected;
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Occupancy
  const totalBeds = rooms.reduce((s, r) => s + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((s, r) => s + r.tenantIds.length, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  res.json({
    complaints: { total, open, inProgress, resolved, escalated, avgResolutionHrs, byCategory },
    billing: { totalExpected, totalCollected, totalPending, collectionRate },
    occupancy: { totalBeds, occupiedBeds, vacantBeds: totalBeds - occupiedBeds, occupancyRate },
  });
}

module.exports = { getAnalytics };
