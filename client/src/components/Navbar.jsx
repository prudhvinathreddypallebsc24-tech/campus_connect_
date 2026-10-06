// src/components/Navbar.jsx – top bar with hamburger + page title
import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth()
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-actions">
        <span className="topbar-user">👤 {user?.name}</span>
      </div>
    </header>
  )
}
