// src/components/ComplaintCard.jsx – displays one complaint with escalation badge
// Props: complaint, onUpvote, onStatusChange (optional, owner only)
import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ComplaintCard({ complaint, onUpvote, isOwner }) {
  const c = complaint

  return (
    <div className={`complaint-card${c.isEscalated ? ' escalated' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <Link to={`/complaints/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="complaint-title">
            {c.title}
            {/* STUDENT MODIFICATION 1: escalation badge */}
            {c.isEscalated && (
              <span className="badge badge-escalated" style={{ marginLeft: 8, fontSize: 11 }}>
                🚨 ESCALATED
              </span>
            )}
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onUpvote && onUpvote(c.id)}
            title="Upvote"
          >
            👍 {c.upvotes}
          </button>
        </div>
      </div>

      <div className="complaint-desc" style={{ marginTop: 4 }}>
        Room {c.roomId} · {c.tenantName} · {c.category}
      </div>

      <div className="complaint-meta">
        <StatusBadge status={c.status} />
        <span className={`badge badge-${(c.priority || 'low').toLowerCase()}`}>{c.priority}</span>
        <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {c.daysOpen ?? '?'} days old</span>
        {/* STUDENT MODIFICATION 1: priority score */}
        <span className="mod-tag" title="Student Modification 1">MOD1</span>
        <span style={{ fontSize: 12, color: '#6d28d9', fontWeight: 700 }}>
          Score: {c.priorityScore ?? 0}
        </span>
      </div>
    </div>
  )
}
