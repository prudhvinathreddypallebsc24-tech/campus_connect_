// src/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'tenant', roomId: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim())   e.name     = 'Name is required.'
    if (!form.email.trim())  e.email    = 'Email is required.'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
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
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>PG Desk</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          {apiErr && <div className="error-msg">{apiErr}</div>}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" placeholder="Aarav Patel" value={form.name} onChange={handleChange} />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email" placeholder="you@pg.com" value={form.email} onChange={handleChange} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" placeholder="min 6 characters" value={form.password} onChange={handleChange} />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" name="role" value={form.role} onChange={handleChange}>
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room ID (optional)</label>
              <input className="form-control" name="roomId" placeholder="e.g. 101" value={form.roomId} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          Have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
