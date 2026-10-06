// src/components/DashboardCard.jsx – reusable stat card (functional component)
// Props: title, value, sub, color
import React from 'react'

export default function DashboardCard({ title, value, sub, color = '' }) {
  return (
    <div className={`card stat-card ${color}`}>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  )
}
