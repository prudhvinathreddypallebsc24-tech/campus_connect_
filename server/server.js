/**
 * server.js
 * Campus Connect — CS3301 Full Stack Development
 * Experiment 6: Developing and Consuming Backend Services
 *               Using RESTful API Principles
 *
 * ══════════════════════════════════════════════════════════════
 * MIDDLEWARE FLOW (Experiment 6 core concept)
 * ══════════════════════════════════════════════════════════════
 *
 *   Postman / Frontend
 *          |
 *          v
 *   HTTP Request arrives at Express
 *          |
 *          v
 *   express.json()     ← parses JSON body → populates req.body
 *          |
 *          v
 *   cors()             ← allows cross-origin requests (frontend ↔ backend)
 *          |
 *          v
 *   logger middleware  ← logs method + URL + timestamp
 *          |
 *          v
 *   Route matched?
 *    YES → /api/students → studentRoutes → studentController → response
 *    NO  → notFound middleware → 404 JSON response
 *
 *   On any controller error:
 *   next(error) → errorHandler middleware → JSON error response
 *
 * ══════════════════════════════════════════════════════════════
 */

const express = require('express');
const cors = require('cors');

// ── Import middleware ────────────────────────────────────────
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ── Import routes ────────────────────────────────────────────
const studentRoutes = require('./routes/studentRoutes');

// ── Create Express application ───────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ══════════════════════════════════════════════════════════════
// MIDDLEWARE REGISTRATION
// Each app.use() adds a middleware to the request pipeline.
// Middleware executes in the ORDER it is registered.
// ══════════════════════════════════════════════════════════════

/**
 * 1. CORS Middleware
 * Allows the React frontend (port 5173) to call this API (port 5000).
 * Without this, browsers would block cross-origin requests.
 */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * 2. JSON Body Parser Middleware (built into Express)
 * Parses incoming requests with JSON payloads.
 * Without this, req.body would be undefined for POST/PUT requests.
 */
app.use(express.json());

/**
 * 3. URL-encoded body parser
 * Handles form-submitted data (good practice to include).
 */
app.use(express.urlencoded({ extended: false }));

/**
 * 4. Custom Request Logger Middleware
 * Logs every incoming request: [timestamp] METHOD /path
 */
app.use(logger);

// ══════════════════════════════════════════════════════════════
// API ROUTES
// ══════════════════════════════════════════════════════════════

/**
 * Mount student routes at /api/students
 * All routes in studentRoutes.js will be prefixed with /api/students
 */
app.use('/api/students', studentRoutes);

/**
 * Root route — confirms API is running
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Connect REST API',
    version: '1.0.0',
    experiment: 'CS3301 Experiment 6',
    endpoints: {
      students: '/api/students',
    },
  });
});

// ══════════════════════════════════════════════════════════════
// ERROR MIDDLEWARE (must be registered AFTER routes)
// ══════════════════════════════════════════════════════════════

/**
 * 5. 404 Not Found Middleware
 * Catches any request that did not match a registered route above.
 */
app.use(notFound);

/**
 * 6. Centralized Error Handler
 * Catches errors forwarded via next(error) from controllers.
 * Must have 4 parameters: (err, req, res, next)
 */
app.use(errorHandler);

// ══════════════════════════════════════════════════════════════
// START SERVER
// ══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║      Campus Connect REST API              ║');
  console.log('║      CS3301 Experiment 6                  ║');
  console.log('╠═══════════════════════════════════════════╣');
  console.log(`║  Server : http://localhost:${PORT}          ║`);
  console.log(`║  API    : http://localhost:${PORT}/api      ║`);
  console.log('╠═══════════════════════════════════════════╣');
  console.log('║  Endpoints:                               ║');
  console.log('║  GET    /api/students                     ║');
  console.log('║  GET    /api/students/:id                 ║');
  console.log('║  POST   /api/students                     ║');
  console.log('║  PUT    /api/students/:id                 ║');
  console.log('║  DELETE /api/students/:id                 ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
