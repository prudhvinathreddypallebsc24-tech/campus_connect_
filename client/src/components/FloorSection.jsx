// src/components/FloorSection.jsx – renders one floor's rooms
// Props: floor (number), rooms (array), onSelectRoom
import React from 'react'
import RoomCard from './RoomCard'

export default function FloorSection({ floor, rooms, onSelectRoom }) {
  const totalBeds    = rooms.reduce((s, r) => s + r.totalBeds, 0)
  const occupiedBeds = rooms.reduce((s, r) => s + r.occupiedBeds, 0)
  const vacantBeds   = totalBeds - occupiedBeds

  return (
    <div className="floor-section">
      <div className="floor-header">
        <span>Floor {floor}</span>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {rooms.length} rooms · {occupiedBeds} occupied · <strong style={{ color: vacantBeds > 0 ? '#16a34a' : '#dc2626' }}>{vacantBeds} vacant</strong>
        </span>
      </div>
      <div className="rooms-grid">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} onSelect={onSelectRoom} />
        ))}
      </div>
    </div>
  )
}
