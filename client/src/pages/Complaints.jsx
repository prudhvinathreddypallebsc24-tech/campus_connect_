// src/pages/Complaints.jsx – list with filter/search/sort
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getComplaints, upvoteComplaint } from '../services/api'
import ComplaintCard from '../components/ComplaintCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['All', 'Water', 'Electricity', 'WiFi', 'Cleaning', 'Food', 'Maintenance', 'Other']
const STATUSES   = ['All', 'Open', 'In Progress', 'Resolved']

export default function Complaints() {
  const { user } = useAuth()
  const isOwner  = user?.role === 'owner'

  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('All')
  const [statFilter, setStatFilter] = useState('All')
  const [sortBy,     setSortBy]     = useState('priority')

  useEffect(() => {
    getComplaints()
      .then(r => setComplaints(r.data))
      .catch(e => setError(e.response?.data?.error || 'Failed to load complaints'))
      .finally(() => setLoading(false))
  }, [])

  async function handleUpvote(id) {
    try {
      const { data } = await upvoteComplaint(id)
      setComplaints(prev => prev.map(c => c.id === id ? data : c))
    } catch (e) {
      alert(e.response?.data?.error || 'Upvote failed')
    }
  }

  // Filter + search + sort
  let visible = complaints
  if (!isOwner) visible = visible.filter(c => c.tenantId === user?.id)
  if (catFilter  !== 'All') visible = visible.filter(c => c.category === catFilter)
  if (statFilter !== 'All') visible = visible.filter(c => c.status   === statFilter)
  if (search) {
    const q = search.toLowerCase()
    visible = visible.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.roomId.includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  }
  if (sortBy === 'newest')   visible = [...visible].sort((a, b) => b.createdAt - a.createdAt)
  if (sortBy === 'oldest')   visible = [...visible].sort((a, b) => a.createdAt - b.createdAt)
  if (sortBy === 'priority') visible = [...visible].sort((a, b) => b.priorityScore - a.priorityScore)
  if (sortBy === 'upvotes')  visible = [...visible].sort((a, b) => b.upvotes - a.upvotes)
  if (sortBy === 'age')      visible = [...visible].sort((a, b) => b.hoursOpen - a.hoursOpen)

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMessage msg={error} />

  return (
    <div>
      <div className="section-header">
        <h3>Complaints ({visible.length})</h3>
        <Link to="/complaints/new"><button className="btn btn-primary btn-sm">+ New Complaint</button></Link>
      </div>

      <div className="filter-bar">
        <input placeholder="Search room, title, category…" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={catFilter}  onChange={e => setCatFilter(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statFilter} onChange={e => setStatFilter(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="priority">Sort: Priority Score</option>
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="upvotes">Sort: Most Upvoted</option>
          <option value="age">Sort: Longest Unresolved</option>
        </select>
      </div>

      {visible.length === 0
        ? <EmptyState title="No complaints found" message="Try changing filters or raise a new complaint." />
        : visible.map(c => (
            <ComplaintCard key={c.id} complaint={c} onUpvote={handleUpvote} isOwner={isOwner} />
          ))
      }
    </div>
  )
}
