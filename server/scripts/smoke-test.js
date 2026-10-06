// scripts/smoke-test.js – hits every major endpoint, prints PASS/FAIL
// Run: node scripts/smoke-test.js (server must be running on port 5000)

const http = require('http');

let ownerToken = '';
let tenantToken = '';
let complaintId = '';
let billId = '';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost', port: 5000,
      path: `/api${path}`, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function check(label, condition) {
  console.log(`${condition ? '✅ PASS' : '❌ FAIL'} — ${label}`);
}

async function run() {
  console.log('\n=== PG Desk Smoke Test ===\n');

  // 1. Owner login
  let r = await request('POST', '/auth/login', { email: 'owner@pgdesk.com', password: 'password123' });
  check('POST /auth/login (owner)', r.status === 200 && r.body.token);
  ownerToken = r.body.token || '';

  // 2. Tenant login
  r = await request('POST', '/auth/login', { email: 'tenant@pgdesk.com', password: 'password123' });
  check('POST /auth/login (tenant)', r.status === 200 && r.body.token);
  tenantToken = r.body.token || '';

  // 3. Register new user
  r = await request('POST', '/auth/register', { name: 'Test User', email: `test${Date.now()}@pg.com`, password: 'password123' });
  check('POST /auth/register', r.status === 201 && r.body.token);

  // 4. GET rooms
  r = await request('GET', '/rooms', null, ownerToken);
  check('GET /rooms', r.status === 200 && Array.isArray(r.body) && r.body.length === 42);

  // 5. GET rooms/:id
  r = await request('GET', '/rooms/101', null, ownerToken);
  check('GET /rooms/101', r.status === 200 && r.body.id === '101');

  // 6. GET complaints
  r = await request('GET', '/complaints', null, ownerToken);
  check('GET /complaints', r.status === 200 && Array.isArray(r.body) && r.body.length > 0);
  complaintId = r.body[0]?.id || 'c1';

  // 7. GET complaints/:id
  r = await request('GET', `/complaints/${complaintId}`, null, ownerToken);
  check('GET /complaints/:id', r.status === 200 && r.body.id === complaintId);

  // 8. POST /complaints (tenant creates)
  r = await request('POST', '/complaints', {
    roomId: '101', category: 'WiFi', title: 'Smoke test complaint',
    description: 'Testing complaint creation from smoke test.', priority: 'Low',
  }, tenantToken);
  check('POST /complaints', r.status === 201 && r.body.id);

  // 9. PATCH /complaints/:id/status (owner)
  r = await request('PATCH', `/complaints/${complaintId}/status`, { status: 'In Progress', ownerNote: 'Smoke test note' }, ownerToken);
  check('PATCH /complaints/:id/status (owner)', r.status === 200);

  // 10. POST /complaints/:id/upvote
  r = await request('POST', `/complaints/c5/upvote`, null, ownerToken);
  check('POST /complaints/:id/upvote', r.status === 200 || r.status === 400); // 400 = already upvoted OK

  // 11. GET /bills (owner)
  r = await request('GET', '/bills', null, ownerToken);
  check('GET /bills (owner)', r.status === 200 && Array.isArray(r.body));
  billId = r.body[1]?.id || 'b2';

  // 12. GET /bills/my-share (tenant)
  r = await request('GET', '/bills/my-share', null, tenantToken);
  check('GET /bills/my-share (tenant)', r.status === 200 && r.body.formula);

  // 13. POST /bills (owner)
  r = await request('POST', '/bills', { tenantId: 'u12', month: '2026-10', baseRent: 5500 }, ownerToken);
  check('POST /bills (owner)', r.status === 201);

  // 14. PATCH /bills/:id/payment (owner)
  r = await request('PATCH', `/bills/${billId}/payment`, { amountPaid: 6000 }, ownerToken);
  check('PATCH /bills/:id/payment', r.status === 200);

  // 15. POST /absences
  r = await request('POST', '/absences', { month: '2026-10', daysAway: 3 }, tenantToken);
  check('POST /absences', r.status === 200 || r.status === 201);

  // 16. GET /absences
  r = await request('GET', '/absences', null, tenantToken);
  check('GET /absences', r.status === 200 && Array.isArray(r.body));

  // 17. GET /analytics (owner)
  r = await request('GET', '/analytics', null, ownerToken);
  check('GET /analytics (owner)', r.status === 200 && r.body.complaints);

  // 18. POST /dev/reset (owner)
  r = await request('POST', '/dev/reset', null, ownerToken);
  check('POST /dev/reset (owner)', r.status === 200);

  // 19. Auth guard: no token → 401
  r = await request('GET', '/rooms', null, null);
  check('Auth guard: GET /rooms without token → 401', r.status === 401);

  // 20. Role guard: tenant → /analytics → 403
  r = await request('GET', '/analytics', null, tenantToken);
  check('Role guard: tenant GET /analytics → 403', r.status === 403);

  console.log('\n=== Smoke test complete ===\n');
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
