// roomController.js – room/bed occupancy (derived, never stored)
const { store } = require('../data/seedData');

// GET /api/rooms
function getRooms(req, res) {
  const rooms = store.rooms.map(r => ({
    ...r,
    occupiedBeds: r.tenantIds.length,
    vacantBeds: r.totalBeds - r.tenantIds.length,
  }));
  res.json(rooms);
}

// GET /api/rooms/:id
function getRoomById(req, res) {
  const room = store.rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({
    ...room,
    occupiedBeds: room.tenantIds.length,
    vacantBeds: room.totalBeds - room.tenantIds.length,
    tenants: store.users.filter(u => room.tenantIds.includes(u.id)).map(u => ({ id: u.id, name: u.name, email: u.email })),
  });
}

module.exports = { getRooms, getRoomById };
