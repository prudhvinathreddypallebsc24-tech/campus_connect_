// authController.js – register and login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { store } = require('../data/seedData');

const JWT_SECRET = process.env.JWT_SECRET || 'pgdesk_secret_fallback_2024';
const JWT_EXPIRY = '8h';

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, roomId: user.roomId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// POST /api/auth/login
function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required', details: 'Both fields are mandatory' });
  }
  const user = store.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, roomId: user.roomId } });
}

// POST /api/auth/register
function register(req, res) {
  const { name, email, password, role, roomId } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Validation failed', details: 'name, email, password are required' });
  }
  if (store.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const assignedRole = role === 'owner' ? 'owner' : 'tenant';
  const newUser = {
    id: `u${++store.nextId}`,
    name, email,
    password: bcrypt.hashSync(password, 10),
    role: assignedRole,
    roomId: roomId || null,
  };
  store.users.push(newUser);

  if (roomId) {
    const room = store.rooms.find(r => r.id === roomId);
    if (room) room.tenantIds.push(newUser.id);
  }

  const token = signToken(newUser);
  res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, roomId: newUser.roomId } });
}

module.exports = { login, register };
