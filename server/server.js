// server.js – PG Desk Express server
// Ports: 5000 (server), 5173 (client)
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { resetStore } = require('./data/seedData');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── PUBLIC ROUTES (no auth needed) ──────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────
app.use('/api/rooms',      require('./routes/roomRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/bills',      require('./routes/billRoutes'));
app.use('/api/absences',   require('./routes/absenceRoutes'));
app.use('/api/analytics',  require('./routes/analyticsRoutes'));

// ─── DEV RESET (owner only) ───────────────────────────────────────────────────
app.post('/api/dev/reset', authMiddleware, roleMiddleware('owner'), (req, res) => {
  resetStore();
  res.json({ message: 'Demo data reset to seed state.' });
});

// ─── HEALTH ──────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ app: 'PG Desk API', status: 'running', port: PORT });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n✅ PG Desk server running on http://localhost:${PORT}\n`);
});

module.exports = app;
