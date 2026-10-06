// src/pages/Rooms.jsx
import React, { useState, useEffect } from 'react'
import { getRooms } from '../services/api'
import FloorSection from '../components/FloorSection'
import DashboardCard from '../components/DashboardCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Modal from '../components/Modal'

export default function Rooms() {
  const [rooms,   setRooms]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [selected,setSelected]= useState(null)   // for room detail modal

  useEffect(() => {
    getRooms()
      .then(r => setRooms(r.data))
      .catch(e => setError(e.response?.data?.error || 'Failed to load rooms'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage msg={error} />

  // Derived totals
  const totalBeds    = rooms.reduce((s, r) => s + r.totalBeds, 0)
  const occupiedBeds = rooms.reduce((s, r) => s + r.occupiedBeds, 0)
  const vacantBeds   = totalBeds - occupiedBeds

  // Group by floor
  const floors = {}
  rooms.forEach(r => {
    if (!floors[r.floor]) floors[r.floor] = []
    floors[r.floor].push(r)
  })

  function handleSelectRoom(room) {
    setSelected(room)
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <DashboardCard title="Total Rooms" value={42} />
        <DashboardCard title="Total Beds"  value={totalBeds} />
        <DashboardCard title="Occupied Beds" value={occupiedBeds} color="info" />
        <DashboardCard title="Vacant Beds"   value={vacantBeds}   color={vacantBeds > 0 ? 'green' : 'red'} />
      </div>

      {/* Floor sections */}
      {Object.keys(floors).sort((a, b) => +a - +b).map(floor => (
        <FloorSection
          key={floor}
          floor={floor}
          rooms={floors[floor]}
          onSelectRoom={handleSelectRoom}
        />
      ))}

      {/* Room detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Room ${selected?.number} Details`}>
        {selected && (
          <div>
            <p><strong>Floor:</strong> {selected.floor}</p>
            <p><strong>Total Beds:</strong> {selected.totalBeds}</p>
            <p><strong>Occupied:</strong> {selected.occupiedBeds}</p>
            <p><strong>Vacant:</strong> {selected.vacantBeds}</p>
            <p style={{ marginTop: 8, color: '#64748b' }}>
              Status: {selected.vacantBeds === 0
                ? <span style={{ color: '#dc2626' }}>Full</span>
                : <span style={{ color: '#16a34a' }}>{selected.vacantBeds} bed(s) available</span>
              }
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
