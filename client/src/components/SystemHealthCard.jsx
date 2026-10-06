// src/components/SystemHealthCard.jsx
// *** REQUIRED CLASS COMPONENT – rendered on Dashboard ***
import React, { Component } from 'react'

class SystemHealthCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiStatus: 'Checking...',
      lastChecked: null,
    }
    this.checkHealth = this.checkHealth.bind(this)
  }

  // Called once when component mounts – checks API health
  componentDidMount() {
    this.checkHealth()
    // Refresh every 60 seconds
    this.interval = setInterval(this.checkHealth, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async checkHealth() {
    try {
      const res = await fetch('http://localhost:5000/')
      const data = await res.json()
      this.setState({ apiStatus: data.status === 'running' ? 'Online ✅' : 'Degraded ⚠️', lastChecked: new Date() })
    } catch {
      this.setState({ apiStatus: 'Offline ❌', lastChecked: new Date() })
    }
  }

  render() {
    const { totalRooms, openComplaints, escalated } = this.props
    const { apiStatus, lastChecked } = this.state

    return (
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            System Status <span className="mod-tag">Class Component</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={this.checkHealth}>Refresh</button>
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div><div style={{ fontSize: 12, color: '#64748b' }}>API Status</div><strong>{apiStatus}</strong></div>
          <div><div style={{ fontSize: 12, color: '#64748b' }}>Total Rooms</div><strong>{totalRooms ?? '—'}</strong></div>
          <div><div style={{ fontSize: 12, color: '#64748b' }}>Open Complaints</div><strong>{openComplaints ?? '—'}</strong></div>
          <div><div style={{ fontSize: 12, color: '#64748b' }}>Escalated</div><strong style={{ color: escalated > 0 ? '#dc2626' : '#16a34a' }}>{escalated ?? '—'}</strong></div>
          <div><div style={{ fontSize: 12, color: '#64748b' }}>Last Updated</div><strong>{lastChecked ? lastChecked.toLocaleTimeString() : '—'}</strong></div>
        </div>
      </div>
    )
  }
}

export default SystemHealthCard
