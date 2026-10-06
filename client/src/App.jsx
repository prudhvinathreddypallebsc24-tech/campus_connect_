// src/App.jsx – routing, layout, protected routes
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Sidebar from './components/Sidebar'
import Navbar  from './components/Navbar'

import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import Rooms          from './pages/Rooms'
import Complaints     from './pages/Complaints'
import NewComplaint   from './pages/NewComplaint'
import ComplaintDetails from './pages/ComplaintDetails'
import Bills          from './pages/Bills'
import Analytics      from './pages/Analytics'

// Route titles map
const TITLES = {
  '/dashboard':     'Dashboard',
  '/rooms':         'Room Management',
  '/complaints':    'Complaints',
  '/complaints/new':'New Complaint',
  '/bills':         'Bills & Payments',
  '/analytics':     'Analytics',
}

// Protected wrapper – redirects to /login if not authenticated
function PrivateRoute({ children, ownerOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (ownerOnly && user.role !== 'owner') return <Navigate to="/dashboard" replace />
  return children
}

// Layout with sidebar + navbar
function AppLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="main-content">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(o => !o)} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      {/* Protected */}
      <Route path="/dashboard" element={
        <PrivateRoute><AppLayout title="Dashboard"><Dashboard /></AppLayout></PrivateRoute>
      } />
      <Route path="/rooms" element={
        <PrivateRoute ownerOnly><AppLayout title="Room Management"><Rooms /></AppLayout></PrivateRoute>
      } />
      <Route path="/complaints" element={
        <PrivateRoute><AppLayout title="Complaints"><Complaints /></AppLayout></PrivateRoute>
      } />
      <Route path="/complaints/new" element={
        <PrivateRoute><AppLayout title="New Complaint"><NewComplaint /></AppLayout></PrivateRoute>
      } />
      <Route path="/complaints/:id" element={
        <PrivateRoute><AppLayout title="Complaint Details"><ComplaintDetails /></AppLayout></PrivateRoute>
      } />
      <Route path="/bills" element={
        <PrivateRoute><AppLayout title="Bills & Payments"><Bills /></AppLayout></PrivateRoute>
      } />
      <Route path="/analytics" element={
        <PrivateRoute ownerOnly><AppLayout title="Analytics"><Analytics /></AppLayout></PrivateRoute>
      } />
      {/* Default */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
