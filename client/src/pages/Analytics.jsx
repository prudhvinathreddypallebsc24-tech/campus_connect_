// src/pages/Analytics.jsx – owner-only analytics with CSS bar charts
import React, { useState, useEffect } from 'react'
import { getAnalytics } from '../services/api'
import DashboardCard from '../components/DashboardCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Analytics() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getAnalytics()
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage msg={error} />
  if (!data)   return null

  const { complaints: c, billing: b, occupancy: o } = data
  const maxCat = Math.max(...Object.values(c.byCategory), 1)

  return (
    <div>
      <div className="section-header">
        <h3>PG Desk Analytics</h3>
        <span style={{ color: '#64748b', fontSize: 13 }}>Live from API · Owner only</span>
      </div>

      {/* Complaint overview */}
      <div className="analytics-grid">
        <DashboardCard title="Total Complaints"       value={c.total}            />
        <DashboardCard title="Open"                   value={c.open}             color="yellow" />
        <DashboardCard title="In Progress"            value={c.inProgress}       color="info" />
        <DashboardCard title="Resolved"               value={c.resolved}         color="green" />
        <DashboardCard title="Escalated 🚨"          value={c.escalated}        color={c.escalated > 0 ? 'red' : 'green'} sub="Student Mod 1" />
        <DashboardCard title="Avg Resolution Time"    value={`${c.avgResolutionHrs}h`} color="info" />
      </div>

      {/* Category bar chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>Complaints by Category</div>
        <div className="bar-chart">
          {Object.entries(c.byCategory).map(([cat, count]) => (
            <div key={cat} className="bar-row">
              <div className="bar-label">{cat}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / maxCat) * 100}%` }} />
              </div>
              <div className="bar-count">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing + Occupancy */}
      <div className="analytics-grid">
        <DashboardCard title="Total Expected"   value={`₹${b.totalExpected?.toLocaleString('en-IN')}`} />
        <DashboardCard title="Total Collected"  value={`₹${b.totalCollected?.toLocaleString('en-IN')}`} color="green" />
        <DashboardCard title="Total Pending"    value={`₹${b.totalPending?.toLocaleString('en-IN')}`}   color="yellow" />
        <DashboardCard title="Collection Rate"  value={`${b.collectionRate}%`}                          color={b.collectionRate >= 80 ? 'green' : 'red'} />
        <DashboardCard title="Occupancy Rate"   value={`${o.occupancyRate}%`}                           color="info" />
        <DashboardCard title="Vacant Beds"      value={o.vacantBeds}                                    color={o.vacantBeds > 0 ? 'green' : 'red'} />
      </div>

      {/* Billing bar */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Billing Summary</div>
        <div className="bar-chart">
          {[
            { label: 'Expected',  val: b.totalExpected },
            { label: 'Collected', val: b.totalCollected },
            { label: 'Pending',   val: b.totalPending },
          ].map(({ label, val }) => (
            <div key={label} className="bar-row">
              <div className="bar-label">{label}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${b.totalExpected > 0 ? (val / b.totalExpected) * 100 : 0}%`, background: label === 'Pending' ? '#f59e0b' : label === 'Collected' ? '#16a34a' : '#2563eb' }} />
              </div>
              <div className="bar-count" style={{ width: 80, fontSize: 11 }}>₹{val?.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
