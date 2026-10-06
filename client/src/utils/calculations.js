// src/utils/calculations.js
// Client-side display helpers – SAME formulas as server (display only)

// STUDENT MODIFICATION 1: escalation + priority score
const ESCALATION_HOURS = {
  Water: 48, Electricity: 48, WiFi: 48,
  Cleaning: 72, Food: 72, Maintenance: 72, Other: 72,
}

export function calcComplaintAge(createdAt) {
  const ms = Date.now() - new Date(createdAt).getTime()
  const hours = ms / 3600000
  const days  = hours / 24
  return { hours: Math.round(hours), days: Math.round(days * 10) / 10 }
}

export function calcEscalated(complaint) {
  if (complaint.status === 'Resolved') return false
  const { hours } = calcComplaintAge(complaint.createdAt)
  const threshold = ESCALATION_HOURS[complaint.category] || 72
  return hours >= threshold
}

export function calcPriorityScore(complaint) {
  const { days } = calcComplaintAge(complaint.createdAt)
  return Math.round(complaint.upvotes * Math.max(days, 1))
}

// STUDENT MODIFICATION 2: bill share formula
export function calcBillShare(totalSharedBill, totalPersonDays, daysPresent) {
  if (totalPersonDays === 0) return 0
  return Math.round((totalSharedBill / totalPersonDays) * daysPresent)
}

export function calcVacantBeds(room) {
  return room.totalBeds - (room.occupiedBeds ?? room.tenantIds?.length ?? 0)
}

export function calcCollectionStats(bills) {
  const expected  = bills.reduce((s, b) => s + (b.totalAmount || 0), 0)
  const collected = bills.reduce((s, b) => s + (b.amountPaid  || 0), 0)
  return { expected, collected, pending: expected - collected }
}
