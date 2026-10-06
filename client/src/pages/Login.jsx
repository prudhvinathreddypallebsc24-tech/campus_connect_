// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Both fields are required.'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>PG Desk</h1>
          <p>Transparent PG management for rooms, complaints &amp; payments.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email" placeholder="owner@pgdesk.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" placeholder="password123" value={form.password} onChange={handleChange} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
          No account? <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>
        <div style={{ marginTop: 20, padding: '12px', background: '#f0f9ff', borderRadius: 6, fontSize: 12 }}>
          <strong>Demo accounts:</strong><br />
          Owner: owner@pgdesk.com / password123<br />
          Tenant: tenant@pgdesk.com / password123
        </div>
      </div>
    </div>
  )
}
