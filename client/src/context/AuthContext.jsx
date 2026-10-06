// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount (useEffect)
  useEffect(() => {
    const stored = localStorage.getItem('pgdesk_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  async function login(email, password) {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('pgdesk_token', data.token)
    localStorage.setItem('pgdesk_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function register(form) {
    const { data } = await apiRegister(form)
    localStorage.setItem('pgdesk_token', data.token)
    localStorage.setItem('pgdesk_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('pgdesk_token')
    localStorage.removeItem('pgdesk_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
