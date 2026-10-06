// src/services/api.js – ALL React-to-Express communication goes through here
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('pgdesk_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auth
export const login    = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

// Rooms
export const getRooms  = ()   => api.get('/rooms')
export const getRoomById = (id) => api.get(`/rooms/${id}`)

// Complaints
export const getComplaints     = ()       => api.get('/complaints')
export const getComplaintById  = (id)     => api.get(`/complaints/${id}`)
export const createComplaint   = (data)   => api.post('/complaints', data)
export const updateStatus      = (id, data) => api.patch(`/complaints/${id}/status`, data)
export const upvoteComplaint   = (id)     => api.post(`/complaints/${id}/upvote`)

// Bills
export const getBills       = ()       => api.get('/bills')
export const getMyShare     = ()       => api.get('/bills/my-share')
export const createBill     = (data)   => api.post('/bills', data)
export const updatePayment  = (id, data) => api.patch(`/bills/${id}/payment`, data)

// Absences
export const markAbsence  = (data) => api.post('/absences', data)
export const getAbsences  = ()     => api.get('/absences')

// Analytics
export const getAnalytics = () => api.get('/analytics')

// Dev reset
export const resetDemo = () => api.post('/dev/reset')

export default api
