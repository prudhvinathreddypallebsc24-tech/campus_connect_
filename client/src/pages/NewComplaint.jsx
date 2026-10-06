// src/pages/NewComplaint.jsx – form to raise a complaint
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createComplaint } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['Water', 'Electricity', 'WiFi', 'Cleaning', 'Food', 'Maintenance', 'Other']
const PRIORITIES = ['Low', 'Medium', 'High']

export default function NewComplaint() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    roomId: user?.roomId || '',
    category: 'Water',
    title: '',
    description: '',
    priority: 'Medium',
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  function validate() {
    const e = {}
    if (!form.roomId.trim())           e.roomId      = 'Room number is required.'
    if (form.title.trim().length < 5)  e.title       = 'Title must be at least 5 characters.'
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.'
    return e
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiErr('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const { data } = await createComplaint(form)
      navigate(`/complaints/${data.id}`)
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="section-header">
        <h3>Raise a Complaint</h3>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {apiErr && <div className="error-msg">{apiErr}</div>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <input className="form-control" name="roomId" placeholder="e.g. 101" value={form.roomId} onChange={handleChange} />
              {errors.roomId && <div className="form-error">{errors.roomId}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-control" name="title" placeholder="Brief description of the issue" value={form.title} onChange={handleChange} maxLength={100} />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Description * (min 10 characters)</label>
            <textarea className="form-control" name="description" placeholder="Describe the issue in detail…" value={form.description} onChange={handleChange} rows={4} />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Priority *</label>
            <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting…' : 'Raise Complaint'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/complaints')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
