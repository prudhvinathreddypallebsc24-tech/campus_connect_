// src/components/EmptyState.jsx
import React from 'react'
export default function EmptyState({ title = 'Nothing here', message = '' }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
      <h3>{title}</h3>
      {message && <p style={{ fontSize: 13, marginTop: 6 }}>{message}</p>}
    </div>
  )
}
