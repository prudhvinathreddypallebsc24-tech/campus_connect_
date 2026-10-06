// src/components/RoomCard.jsx – displays one room's bed status
// Props: room, onSelect
import React from 'react'

export default function RoomCard({ room, onSelect }) {
  const isFull = room.vacantBeds === 0
  return (
    <div
      className={`room-card ${isFull ? 'full' : 'avail'}`}
      onClick={() => onSelect && onSelect(room)}
    >
      <div className="room-number">Room {room.number}</div>
      <div className="room-info">
        <div>Total beds: <strong>{room.totalBeds}</strong></div>
        <div>Occupied: <strong>{room.occupiedBeds}</strong></div>
        <div>Vacant: <strong>{room.vacantBeds}</strong></div>
      </div>
      <div className={`room-status ${isFull ? 'full' : 'avail'}`}>
        {isFull ? 'Full' : `${room.vacantBeds} Vacant`}
      </div>
    </div>
  )
}
