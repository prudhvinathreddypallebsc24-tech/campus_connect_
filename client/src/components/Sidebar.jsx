// src/components/Sidebar.jsx – navigation sidebar
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const isOwner = user?.role === 'owner'

  const links = isOwner
    ? [
        { to: '/dashboard',     label: 'Dashboard' },
        { to: '/rooms',         label: 'Rooms' },
        { to: '/complaints',    label: 'Complaints' },
        { to: '/complaints/new',label: 'New Complaint' },
        { to: '/bills',         label: 'Bills' },
        { to: '/analytics',     label: 'Analytics' },
      ]
    : [
        { to: '/dashboard',     label: 'Dashboard' },
        { to: '/complaints',    label: 'My Complaints' },
        { to: '/complaints/new',label: 'New Complaint' },
        { to: '/bills',         label: 'My Bills' },
      ]

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <h2>PG Desk</h2>
        <p>PG Management Portal</p>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={onClose}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className={`role-badge${isOwner ? ' owner' : ''}`}>
          {user?.role?.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>{user?.name}</div>
        <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  )
}
