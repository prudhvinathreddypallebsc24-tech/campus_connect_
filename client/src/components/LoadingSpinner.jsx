// src/components/LoadingSpinner.jsx
import React from 'react'
export default function LoadingSpinner({ text = 'Loading...' }) {
  return <div className="loading">⏳ {text}</div>
}
