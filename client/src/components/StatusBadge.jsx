// src/components/StatusBadge.jsx – displays complaint/bill status with color
import React from 'react'

export default function StatusBadge({ status }) {
  const map = {
    'Open':           'badge badge-open',
    'In Progress':    'badge badge-inprogress',
    'Resolved':       'badge badge-resolved',
    'Paid':           'badge badge-paid',
    'Pending':        'badge badge-pending',
    'Partially Paid': 'badge badge-partial',
  }
  return <span className={map[status] || 'badge'}>{status}</span>
}
