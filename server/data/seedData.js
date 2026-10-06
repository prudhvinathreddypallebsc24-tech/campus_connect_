// seedData.js – PG Desk in-memory seed data
// All complaint timestamps are RELATIVE to Date.now() so escalation always works.

const bcrypt = require('bcryptjs');

const HASH = bcrypt.hashSync('password123', 10);

// ─── ROOMS ───────────────────────────────────────────────────────────────────
// 6 floors × 7 rooms = 42 rooms
// beds array holds tenant IDs (derived occupancy, never stored as a number)
function makeRooms() {
  const rooms = [];
  const bedCounts = [4, 3, 2, 4, 3, 4, 2]; // 7 per floor
  for (let floor = 1; floor <= 6; floor++) {
    for (let num = 1; num <= 7; num++) {
      const id = `${floor}0${num}`;
      rooms.push({
        id,
        floor,
        number: id,
        totalBeds: bedCounts[num - 1],
        tenantIds: [],   // filled below after tenants are created
      });
    }
  }
  return rooms;
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function makeUsers() {
  return [
    // Owner account
    { id: 'u0', name: 'Ravi Sharma', email: 'owner@pgdesk.com', password: HASH, role: 'owner', roomId: null },
    // Tenant demo account – lives in 101 (has complaints, bill, absence)
    { id: 'u1', name: 'Aarav Patel',   email: 'tenant@pgdesk.com', password: HASH, role: 'tenant', roomId: '101' },
    // Extra tenants
    { id: 'u2', name: 'Bhavna Reddy',  email: 'bhavna@pg.com',    password: HASH, role: 'tenant', roomId: '101' },
    { id: 'u3', name: 'Chirag Mehta',  email: 'chirag@pg.com',    password: HASH, role: 'tenant', roomId: '101' },
    { id: 'u4', name: 'Divya Singh',   email: 'divya@pg.com',     password: HASH, role: 'tenant', roomId: '102' },
    { id: 'u5', name: 'Eshan Kumar',   email: 'eshan@pg.com',     password: HASH, role: 'tenant', roomId: '102' },
    { id: 'u6', name: 'Faisal Ahmed',  email: 'faisal@pg.com',    password: HASH, role: 'tenant', roomId: '102' },
    { id: 'u7', name: 'Geeta Nair',    email: 'geeta@pg.com',     password: HASH, role: 'tenant', roomId: '103' },
    { id: 'u8', name: 'Harsh Joshi',   email: 'harsh@pg.com',     password: HASH, role: 'tenant', roomId: '201' },
    { id: 'u9', name: 'Isha Gupta',    email: 'isha@pg.com',      password: HASH, role: 'tenant', roomId: '201' },
    { id:'u10', name: 'Jay Pandya',    email: 'jay@pg.com',       password: HASH, role: 'tenant', roomId: '202' },
    { id:'u11', name: 'Komal Shetty',  email: 'komal@pg.com',     password: HASH, role: 'tenant', roomId: '202' },
    { id:'u12', name: 'Lokesh Rao',    email: 'lokesh@pg.com',    password: HASH, role: 'tenant', roomId: '301' },
    { id:'u13', name: 'Meena Pillai',  email: 'meena@pg.com',     password: HASH, role: 'tenant', roomId: '401' },
    { id:'u14', name: 'Nikhil Verma',  email: 'nikhil@pg.com',    password: HASH, role: 'tenant', roomId: '501' },
  ];
}

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────
// Seed RULES: 3 escalated, 1 near-limit, 2 resolved, varied upvotes 0-9
function makeComplaints() {
  const now = Date.now();
  const h = (hrs) => now - hrs * 3600000;

  return [
    // === ESCALATED (>=48h for Water/Electricity/WiFi) ===
    {
      id: 'c1', roomId: '101', tenantId: 'u1', tenantName: 'Aarav Patel',
      category: 'Water', title: 'No hot water in bathroom',
      description: 'The water heater has not been working for more than 2 days. Morning showers are ice cold.',
      priority: 'High', status: 'Open',
      createdAt: h(60), resolvedAt: null, ownerNote: '',
      upvotes: 7, upvotedBy: [],
    },
    {
      id: 'c2', roomId: '201', tenantId: 'u8', tenantName: 'Harsh Joshi',
      category: 'WiFi', title: 'WiFi completely dead on 2nd floor',
      description: 'Internet has been down for over 2 days. Work from home is impossible.',
      priority: 'High', status: 'In Progress',
      createdAt: h(52), resolvedAt: null, ownerNote: 'ISP technician visit scheduled.',
      upvotes: 9, upvotedBy: [],
    },
    {
      id: 'c3', roomId: '102', tenantId: 'u4', tenantName: 'Divya Singh',
      category: 'Electricity', title: 'Power socket sparking in room',
      description: 'One of the wall sockets is sparking when plugging in devices. Fire hazard.',
      priority: 'High', status: 'Open',
      createdAt: h(50), resolvedAt: null, ownerNote: '',
      upvotes: 5, upvotedBy: [],
    },
    // === NEAR-LIMIT (40h Water) ===
    {
      id: 'c4', roomId: '103', tenantId: 'u7', tenantName: 'Geeta Nair',
      category: 'Water', title: 'Water pressure very low',
      description: 'Water trickles out. Cannot fill buckets or shower properly.',
      priority: 'Medium', status: 'In Progress',
      createdAt: h(40), resolvedAt: null, ownerNote: 'Plumber contacted.',
      upvotes: 3, upvotedBy: [],
    },
    // === NORMAL OPEN ===
    {
      id: 'c5', roomId: '202', tenantId: 'u10', tenantName: 'Jay Pandya',
      category: 'Cleaning', title: 'Common area not cleaned for 3 days',
      description: 'The corridor on 2nd floor has not been swept. Dust and trash everywhere.',
      priority: 'Low', status: 'Open',
      createdAt: h(20), resolvedAt: null, ownerNote: '',
      upvotes: 2, upvotedBy: [],
    },
    {
      id: 'c6', roomId: '301', tenantId: 'u12', tenantName: 'Lokesh Rao',
      category: 'Food', title: 'Mess quality very poor this week',
      description: 'Food is undercooked and tasteless for the past week.',
      priority: 'Medium', status: 'Open',
      createdAt: h(15), resolvedAt: null, ownerNote: '',
      upvotes: 6, upvotedBy: [],
    },
    {
      id: 'c7', roomId: '401', tenantId: 'u13', tenantName: 'Meena Pillai',
      category: 'Maintenance', title: 'Window latch broken',
      description: 'Window does not close properly. Rain water entering the room.',
      priority: 'Medium', status: 'Open',
      createdAt: h(30), resolvedAt: null, ownerNote: '',
      upvotes: 0, upvotedBy: [],
    },
    // === RESOLVED ===
    {
      id: 'c8', roomId: '101', tenantId: 'u2', tenantName: 'Bhavna Reddy',
      category: 'Electricity', title: 'Fan not working',
      description: 'The ceiling fan stopped working 3 days ago.',
      priority: 'Low', status: 'Resolved',
      createdAt: h(72), resolvedAt: h(24), ownerNote: 'Fan capacitor replaced.',
      upvotes: 1, upvotedBy: [],
    },
    {
      id: 'c9', roomId: '501', tenantId: 'u14', tenantName: 'Nikhil Verma',
      category: 'WiFi', title: 'Slow internet speed',
      description: 'Speed below 1 Mbps all day.',
      priority: 'Medium', status: 'Resolved',
      createdAt: h(96), resolvedAt: h(48), ownerNote: 'Router rebooted and plan upgraded.',
      upvotes: 4, upvotedBy: [],
    },
    {
      id:'c10', roomId: '202', tenantId: 'u11', tenantName: 'Komal Shetty',
      category: 'Other', title: 'Cockroach infestation',
      description: 'Cockroaches in bathroom and kitchen area.',
      priority: 'High', status: 'Open',
      createdAt: h(78), resolvedAt: null, ownerNote: '',
      upvotes: 8, upvotedBy: [],
    },
  ];
}

// ─── BILLS ────────────────────────────────────────────────────────────────────
function makeBills() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return [
    { id:'b1', tenantId:'u1', tenantName:'Aarav Patel',  roomId:'101', month, baseRent:6000, utilityShare:0, totalAmount:6000, amountPaid:6000, status:'Paid',           paymentDate: new Date(now.getFullYear(), now.getMonth(), 5).toISOString() },
    { id:'b2', tenantId:'u2', tenantName:'Bhavna Reddy', roomId:'101', month, baseRent:6000, utilityShare:0, totalAmount:6000, amountPaid:0,    status:'Pending',         paymentDate: null },
    { id:'b3', tenantId:'u3', tenantName:'Chirag Mehta', roomId:'101', month, baseRent:6000, utilityShare:0, totalAmount:6000, amountPaid:3000, status:'Partially Paid',  paymentDate: new Date(now.getFullYear(), now.getMonth(), 8).toISOString() },
    { id:'b4', tenantId:'u4', tenantName:'Divya Singh',  roomId:'102', month, baseRent:7000, utilityShare:0, totalAmount:7000, amountPaid:7000, status:'Paid',           paymentDate: new Date(now.getFullYear(), now.getMonth(), 3).toISOString() },
    { id:'b5', tenantId:'u5', tenantName:'Eshan Kumar',  roomId:'102', month, baseRent:7000, utilityShare:0, totalAmount:7000, amountPaid:0,    status:'Pending',         paymentDate: null },
    { id:'b6', tenantId:'u6', tenantName:'Faisal Ahmed', roomId:'102', month, baseRent:7000, utilityShare:0, totalAmount:7000, amountPaid:7000, status:'Paid',           paymentDate: new Date(now.getFullYear(), now.getMonth(), 7).toISOString() },
    { id:'b7', tenantId:'u7', tenantName:'Geeta Nair',   roomId:'103', month, baseRent:9000, utilityShare:0, totalAmount:9000, amountPaid:0,    status:'Pending',         paymentDate: null },
    { id:'b8', tenantId:'u8', tenantName:'Harsh Joshi',  roomId:'201', month, baseRent:6000, utilityShare:0, totalAmount:6000, amountPaid:6000, status:'Paid',           paymentDate: new Date(now.getFullYear(), now.getMonth(), 4).toISOString() },
    { id:'b9', tenantId:'u9', tenantName:'Isha Gupta',   roomId:'201', month, baseRent:6000, utilityShare:0, totalAmount:6000, amountPaid:3000, status:'Partially Paid',  paymentDate: new Date(now.getFullYear(), now.getMonth(), 6).toISOString() },
    { id:'b10',tenantId:'u10',tenantName:'Jay Pandya',   roomId:'202', month, baseRent:7000, utilityShare:0, totalAmount:7000, amountPaid:0,    status:'Pending',         paymentDate: null },
  ];
}

// ─── ABSENCES ─────────────────────────────────────────────────────────────────
// Seed absences for CURRENT month, computed dynamically
function makeAbsences() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return [
    { id:'a1', tenantId:'u1', month, totalDays, daysAway: 5 },
    { id:'a2', tenantId:'u2', month, totalDays, daysAway: 0 },
    { id:'a3', tenantId:'u3', month, totalDays, daysAway: 10 },
    { id:'a4', tenantId:'u4', month, totalDays, daysAway: 3 },
    { id:'a5', tenantId:'u5', month, totalDays, daysAway: 7 },
    { id:'a6', tenantId:'u6', month, totalDays, daysAway: 2 },
    { id:'a7', tenantId:'u7', month, totalDays, daysAway: 15 },
    { id:'a8', tenantId:'u8', month, totalDays, daysAway: 0 },
    { id:'a9', tenantId:'u9', month, totalDays, daysAway: 4 },
    { id:'a10',tenantId:'u10',month, totalDays, daysAway: 8 },
  ];
}

// ─── SHARED BILL ──────────────────────────────────────────────────────────────
// Total shared utility bill for the current month (water + electricity + maintenance)
const SHARED_BILL_AMOUNT = 12000;

function getSharedBill() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return { month, totalSharedBill: SHARED_BILL_AMOUNT };
}

// ─── BOOTSTRAP ────────────────────────────────────────────────────────────────
function buildStore() {
  const users = makeUsers();
  const rooms = makeRooms();
  const complaints = makeComplaints();
  const bills = makeBills();
  const absences = makeAbsences();

  // Assign tenants to rooms (derived occupancy)
  users.forEach(u => {
    if (u.roomId) {
      const room = rooms.find(r => r.id === u.roomId);
      if (room) room.tenantIds.push(u.id);
    }
  });

  return { users, rooms, complaints, bills, absences, sharedBill: getSharedBill(), nextId: 1000 };
}

let store = buildStore();

function resetStore() {
  store = buildStore();
}

module.exports = { store, resetStore };
