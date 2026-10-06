// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getRooms, getComplaints, getBills, resetDemo } from '../services/api'
import DashboardCard from '../components/DashboardCard'
import SystemHealthCard from '../components/SystemHealthCard'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { upvoteComplaint } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const isOwner  = user?.role === 'owner'

  const [rooms,      setRooms]      = useState([])
  const [complaints, setComplaints] = useState([])
  const [bills,      setBills]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [resetMsg,   setResetMsg]   = useState('')

  // useEffect: fetch all dashboard data on mount
  useEffect(() => {
    async function load() {
      try {
        const [rR, rC, rB] = await Promise.all([getRooms(), getComplaints(), getBills()])
        setRooms(rR.data)
        setComplaints(rC.data)
        setBills(rB.data)
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Derived stats
  const totalBeds    = rooms.reduce((s, r) => s + r.totalBeds, 0)
  const occupiedBeds = rooms.reduce((s, r) => s + r.occupiedBeds, 0)
  const vacantBeds   = totalBeds - occupiedBeds
  const openC        = complaints.filter(c => c.status === 'Open').length
  const escalated    = complaints.filter(c => c.isEscalated).length
  const totalExp     = bills.reduce((s, b) => s + (b.totalAmount || 0), 0)
  const totalColl    = bills.reduce((s, b) => s + (b.amountPaid  || 0), 0)
  const totalPend    = totalExp - totalColl

  async function handleUpvote(id) {
    try {
      const { data } = await upvoteComplaint(id)
      setComplaints(prev => prev.map(c => c.id === id ? data : c))
    } catch {}
  }

  async function handleReset() {
    await resetDemo()
    setResetMsg('Demo data reset! Refreshing…')
    setTimeout(() => window.location.reload(), 1000)
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage msg={error} />

  // Recent complaints (first 5 after sort)
  const recent = complaints.slice(0, 5)
  // My room for tenant
  const myRoom = rooms.find(r => r.id === user?.roomId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>
          Welcome, {user?.name}!
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 400, marginLeft: 8 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </h2>
        {isOwner && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {resetMsg && <span className="success-msg" style={{ margin: 0 }}>{resetMsg}</span>}
            <button className="btn btn-danger btn-sm" onClick={handleReset}>
              🔄 Reset Demo Data
            </button>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="dashboard-grid">
        <DashboardCard title="Total Rooms"    value={42}           sub="6 floors × 7 rooms" />
        <DashboardCard title="Total Beds"     value={totalBeds}    sub="across all rooms" />
        <DashboardCard title="Occupied Beds"  value={occupiedBeds} color="info" />
        <DashboardCard title="Vacant Beds"    value={vacantBeds}   color={vacantBeds > 0 ? 'green' : 'red'} sub="available" />
        <DashboardCard title="Open Complaints" value={openC}       color={openC > 0 ? 'yellow' : 'green'} />
        <DashboardCard title="Escalated 🚨"  value={escalated}    color={escalated > 0 ? 'red' : 'green'} sub="Student Mod 1" />
        {isOwner && <DashboardCard title="Collected ₹" value={`₹${totalColl.toLocaleString('en-IN')}`} color="green" />}
        {isOwner && <DashboardCard title="Pending ₹"   value={`₹${totalPend.toLocaleString('en-IN')}`} color={totalPend > 0 ? 'yellow' : 'green'} />}
      </div>

      {/* CLASS COMPONENT rendered here */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <SystemHealthCard totalRooms={42} openComplaints={openC} escalated={escalated} />
      </div>

      {/* Tenant: my room info */}
      {!isOwner && myRoom && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">My Room</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Room {myRoom.number} — Floor {myRoom.floor}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            {myRoom.totalBeds} beds · {myRoom.occupiedBeds} occupied · {myRoom.vacantBeds} vacant
          </div>
        </div>
      )}

      {/* Recent / urgent complaints */}
      <div className="section-header">
        <h3>{isOwner ? 'Complaints Requiring Attention' : 'My Recent Complaints'}</h3>
      </div>
      {recent.length === 0
        ? <p style={{ color: '#64748b' }}>No complaints.</p>
        : recent.map(c => (
            <ComplaintCard key={c.id} complaint={c} onUpvote={handleUpvote} isOwner={isOwner} />
          ))
      }
    </div>
  )
}
