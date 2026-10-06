// src/pages/Bills.jsx – billing page with days-present billing (Mod 2)
// STUDENT MODIFICATION 2: days-present bill splitting displayed prominently
import React, { useState, useEffect } from 'react'
import { getBills, getMyShare, updatePayment, markAbsence, getAbsences } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

export default function Bills() {
  const { user } = useAuth()
  const isOwner  = user?.role === 'owner'

  const [bills,    setBills]    = useState([])
  const [share,    setShare]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [payModal, setPayModal] = useState(null)  // {bill}
  const [payAmt,   setPayAmt]   = useState('')
  const [paying,   setPaying]   = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  // Absence form state
  const [absMonth,  setAbsMonth]  = useState(() => new Date().toISOString().slice(0, 7))
  const [absAway,   setAbsAway]   = useState('')
  const [absSaved,  setAbsSaved]  = useState('')
  const [absError,  setAbsError]  = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [bR] = await Promise.all([getBills()])
        setBills(bR.data)
        if (!isOwner) {
          const sR = await getMyShare()
          setShare(sR.data)
        }
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load bills')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Summary stats
  const totalExpected  = bills.reduce((s, b) => s + (b.totalAmount || 0), 0)
  const totalCollected = bills.reduce((s, b) => s + (b.amountPaid  || 0), 0)
  const totalPending   = totalExpected - totalCollected
  const paid    = bills.filter(b => b.status === 'Paid').length
  const pending = bills.filter(b => b.status !== 'Paid').length

  async function handleUpdatePayment(e) {
    e.preventDefault()
    if (!payModal) return
    setPaying(true)
    try {
      const { data } = await updatePayment(payModal.id, { amountPaid: +payAmt })
      setBills(prev => prev.map(b => b.id === data.id ? data : b))
      setPayModal(null)
    } catch (e) {
      alert(e.response?.data?.error || 'Payment update failed')
    } finally {
      setPaying(false)
    }
  }

  async function handleMarkAbsence(e) {
    e.preventDefault()
    setAbsError('')
    if (!absAway || isNaN(+absAway) || +absAway < 0) { setAbsError('Enter valid days away (0 or more).'); return }
    try {
      await markAbsence({ month: absMonth, daysAway: +absAway })
      const sR = await getMyShare()
      setShare(sR.data)
      setAbsSaved('Absence recorded! Bill share updated.')
      setTimeout(() => setAbsSaved(''), 3000)
    } catch (e) {
      setAbsError(e.response?.data?.error || 'Failed to record absence')
    }
  }

  let visible = bills
  if (filterStatus !== 'All') visible = visible.filter(b => b.status === filterStatus)

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage msg={error} />

  return (
    <div>
      {/* Summary cards */}
      {isOwner && (
        <div className="dashboard-grid" style={{ marginBottom: 24 }}>
          <div className="card stat-card"><div className="card-title">Expected</div><div className="card-value">₹{totalExpected.toLocaleString('en-IN')}</div></div>
          <div className="card stat-card green"><div className="card-title">Collected</div><div className="card-value">₹{totalCollected.toLocaleString('en-IN')}</div></div>
          <div className="card stat-card yellow"><div className="card-title">Pending</div><div className="card-value">₹{totalPending.toLocaleString('en-IN')}</div></div>
          <div className="card stat-card info"><div className="card-title">Paid Tenants</div><div className="card-value">{paid}</div></div>
          <div className="card stat-card red"><div className="card-title">Pending Tenants</div><div className="card-value">{pending}</div></div>
        </div>
      )}

      {/* STUDENT MODIFICATION 2 – Tenant bill share section */}
      {!isOwner && share && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontWeight: 700 }}>
              My Utility Share
              <span className="mod-tag" title="Student Modification 2">Student Modification 2</span>
            </h3>
          </div>
          {/* Formula display */}
          <div className="formula-box">
            <div>Total Shared Bill = ₹{share.totalSharedBill?.toLocaleString('en-IN')}</div>
            <div>Total Person-Days = {share.totalPersonDays}</div>
            <div>My Days Present = {share.daysPresent} / {share.totalDays}</div>
            <div style={{ borderTop: '1px solid #bfdbfe', marginTop: 8, paddingTop: 8, fontSize: 15, fontWeight: 700 }}>
              My Share = {share.totalSharedBill} / {share.totalPersonDays} × {share.daysPresent} = ₹{share.myUtilityShare}
            </div>
          </div>

          {/* Mark days away form */}
          <form onSubmit={handleMarkAbsence} style={{ marginTop: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 10 }}>
              Mark Days Away
              <span className="mod-tag">Student Modification 2</span>
            </h4>
            {absSaved && <div className="success-msg">{absSaved}</div>}
            {absError  && <div className="error-msg">{absError}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Month</label>
                <input type="month" className="form-control" value={absMonth} onChange={e => setAbsMonth(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Days Away</label>
                <input type="number" className="form-control" min={0} placeholder="e.g. 5" value={absAway} onChange={e => setAbsAway(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Save Days Away</button>
          </form>
        </div>
      )}

      {/* Bills table / owner */}
      <div className="section-header">
        <h3>Bills ({visible.length})</h3>
        {isOwner && (
          <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Partially Paid</option>
          </select>
        )}
      </div>

      {visible.length === 0
        ? <EmptyState title="No bills found" />
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th><th>Room</th><th>Month</th>
                  <th>Base Rent</th><th>Utility Share</th><th>Total</th>
                  <th>Paid</th><th>Pending</th><th>Status</th>
                  {isOwner && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map(b => (
                  <tr key={b.id}>
                    <td>{b.tenantName}</td>
                    <td>{b.roomId}</td>
                    <td>{b.month}</td>
                    <td>₹{b.baseRent?.toLocaleString('en-IN')}</td>
                    <td>
                      ₹{(b.utilityShare || 0).toLocaleString('en-IN')}
                      {!isOwner && <span className="mod-tag" style={{ marginLeft: 4 }}>MOD2</span>}
                    </td>
                    <td>₹{(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td>₹{(b.amountPaid || 0).toLocaleString('en-IN')}</td>
                    <td>₹{(b.amountPending || 0).toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={b.status} /></td>
                    {isOwner && (
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => { setPayModal(b); setPayAmt(b.amountPaid || '') }}>
                          Update Payment
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      {/* Payment update modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Update Payment">
        {payModal && (
          <form onSubmit={handleUpdatePayment}>
            <p style={{ marginBottom: 12 }}>
              Tenant: <strong>{payModal.tenantName}</strong> · Total: <strong>₹{payModal.totalAmount?.toLocaleString('en-IN')}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Amount Paid (₹)</label>
              <input type="number" className="form-control" value={payAmt} onChange={e => setPayAmt(e.target.value)} min={0} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-success" disabled={paying}>{paying ? 'Saving…' : 'Save Payment'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setPayModal(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
