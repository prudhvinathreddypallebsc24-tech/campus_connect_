// src/pages/ComplaintDetails.jsx – full complaint view with owner actions
// STUDENT MODIFICATION 1 prominently displayed here
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getComplaintById, updateStatus, upvoteComplaint } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ComplaintDetails() {
  const { id }    = useParams()
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const isOwner   = user?.role === 'owner'

  const [complaint, setComplaint] = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [note,      setNote]      = useState('')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState('')

  useEffect(() => {
    getComplaintById(id)
      .then(r => {
        setComplaint(r.data)
        setNewStatus(r.data.status)
        setNote(r.data.ownerNote || '')
      })
      .catch(e => setError(e.response?.data?.error || 'Complaint not found'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleUpdateStatus(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateStatus(id, { status: newStatus, ownerNote: note })
      setComplaint(data)
      setSaved('Updated successfully!')
      setTimeout(() => setSaved(''), 2500)
    } catch (e) {
      setError(e.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpvote() {
    try {
      const { data } = await upvoteComplaint(id)
      setComplaint(data)
    } catch (e) {
      alert(e.response?.data?.error || 'Upvote failed')
    }
  }

  if (loading)   return <LoadingSpinner />
  if (error)     return <ErrorMessage msg={error} />
  if (!complaint) return null

  const c = complaint

  return (
    <div style={{ maxWidth: 720 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/complaints')} style={{ marginBottom: 16 }}>
        ← Back to Complaints
      </button>

      <div className="card">
        {/* Title + escalation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            {c.title}
            {/* STUDENT MODIFICATION 1: escalation badge */}
            {c.isEscalated && (
              <>
                <span className="badge badge-escalated" style={{ marginLeft: 10, fontSize: 13 }}>🚨 ESCALATED</span>
                <span className="mod-tag" title="Student Modification 1">Student Modification 1</span>
              </>
            )}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatusBadge status={c.status} />
            <span className={`badge badge-${(c.priority || 'low').toLowerCase()}`}>{c.priority}</span>
          </div>
        </div>

        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>ID</div><strong>{c.id}</strong></div>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Room</div><strong>{c.roomId}</strong></div>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Tenant</div><strong>{c.tenantName}</strong></div>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Category</div><strong>{c.category}</strong></div>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Age</div><strong>{c.daysOpen} days ({c.hoursOpen}h)</strong></div>
          <div><div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Upvotes</div><strong>{c.upvotes}</strong></div>
        </div>

        {/* Description */}
        <div className="form-group">
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Description</div>
          <p style={{ lineHeight: 1.7 }}>{c.description}</p>
        </div>

        {/* STUDENT MODIFICATION 1: Priority score + escalation detail */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
            📊 Student Modification 1 — Auto-Escalation &amp; Priority Score
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div className="score-box">
              <div className="score-value">{c.priorityScore}</div>
              <div className="score-label">Priority Score<br/>(upvotes × days)</div>
            </div>
            <div>
              <div><strong>Upvotes:</strong> {c.upvotes}</div>
              <div><strong>Days Open:</strong> {c.daysOpen}</div>
              <div><strong>Formula:</strong> {c.upvotes} × {c.daysOpen} = {c.priorityScore}</div>
              <div style={{ marginTop: 8 }}>
                <strong>Escalation:</strong>{' '}
                {c.isEscalated
                  ? <span style={{ color: '#dc2626' }}>🚨 YES – {c.hoursOpen}h ≥ {c.escalationThresholdHours}h threshold</span>
                  : <span style={{ color: '#16a34a' }}>✅ No – {c.hoursOpen}h &lt; {c.escalationThresholdHours}h threshold</span>
                }
              </div>
              {c.resolvedAt && (
                <div><strong>Resolution Time:</strong> {Math.round((new Date(c.resolvedAt) - new Date(c.createdAt)) / 3600000)}h</div>
              )}
            </div>
          </div>
        </div>

        {/* Owner note display */}
        {c.ownerNote && (
          <div className="card" style={{ background: '#fef9c3', borderColor: '#fde68a', marginBottom: 16 }}>
            <strong>Owner Note:</strong> {c.ownerNote}
          </div>
        )}

        {/* Upvote button (tenant) */}
        {!isOwner && (
          <button className="btn btn-outline" onClick={handleUpvote}>
            👍 Upvote ({c.upvotes})
          </button>
        )}

        {/* Owner: status update form */}
        {isOwner && (
          <form onSubmit={handleUpdateStatus} style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <h4 style={{ marginBottom: 12, fontWeight: 700 }}>Update Complaint</h4>
            {saved && <div className="success-msg">{saved}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Owner Note</label>
                <input className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for the tenant…" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Update Complaint'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
