import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Bell,
  ShieldCheck,
  Activity,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/StatCard';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(storageService.getUsers());
    setCourses(storageService.getCourses());
    setEvents(storageService.getEvents());
    setAnnouncements(storageService.getAnnouncements());
    setActivities(storageService.getActivities());
  };

  const studentsCount = users.filter((u) => u.role === 'student').length;
  const facultyCount = users.filter((u) => u.role === 'faculty').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const handleResetData = () => {
    storageService.resetAllData();
    loadData();
    showToast('Platform demonstration data restored to pristine initial state', 'success');
  };

  return (
    <div className="dashboard-container">
      {/* Admin Welcome Banner */}
      <div className="welcome-banner admin-banner">
        <div className="welcome-text-col">
          <div className="welcome-tag admin-tag">
            <ShieldCheck size={16} />
            <span>Central University Administration • Dean's Console</span>
          </div>
          <h1 className="welcome-title">
            Administrator Console: <span className="text-highlight">{user?.name}</span>
          </h1>
          <p className="welcome-subtitle">
            System health optimal. Apex State University currently hosts {studentsCount} enrolled students, {facultyCount} active faculty members, and {courses.length} accredited course offerings.
          </p>

          <div className="welcome-actions">
            <Link to="/admin/users" className="btn btn-primary">
              <Users size={16} />
              <span>Manage User Directory</span>
            </Link>
            <Link to="/admin/events" className="btn btn-secondary">
              <Calendar size={16} />
              <span>Campus Events Hub</span>
            </Link>
            <button
              className="btn btn-outline-white"
              onClick={() => setIsResetDialogOpen(true)}
              title="Reset all demo data back to clean mock baseline"
            >
              <RefreshCw size={15} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* System Health Card */}
        <div className="welcome-profile-snippet admin-health-snippet">
          <div className="profile-snippet-header">
            <div className="system-status-indicator">
              <span className="pulse-dot" />
              <span>Active Node: ASU-EAST-01</span>
            </div>
          </div>
          <div className="profile-snippet-details">
            <div className="detail-row">
              <span className="detail-label">Storage Engine:</span>
              <span className="detail-value font-mono">Local Browser JSON (5.2 KB)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">System Uptime:</span>
              <span className="detail-value text-accent-green font-bold">99.98% Healthy</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Admin Accounts:</span>
              <span className="detail-value">{adminCount} Certified Superusers</span>
            </div>
          </div>
          <Link to="/admin/system" className="snippet-link">
            Open Full Diagnostic Logs <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Students"
          value={studentsCount}
          icon={GraduationCap}
          subtitle="Enrolled undergraduates & postgraduates"
          badgeText="Verified"
          badgeType="success"
          accentColor="navy"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Faculty Members"
          value={facultyCount}
          icon={Users}
          subtitle="Teaching staff & professors"
          badgeText="Accredited"
          badgeType="info"
          accentColor="purple"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Curricular Courses"
          value={courses.length}
          icon={BookOpen}
          subtitle="Active curriculum modules"
          badgeText="Fall 2026"
          badgeType="default"
          accentColor="amber"
          onClick={() => navigate('/admin/courses')}
        />
        <StatCard
          title="Campus Events"
          value={events.length}
          icon={Calendar}
          subtitle="Published campus activities"
          badgeText="Hub Active"
          badgeType="success"
          accentColor="green"
          onClick={() => navigate('/admin/events')}
        />
      </div>

      {/* Admin Two-Column Layout */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Recent Users & Courses */}
        <div className="dashboard-col">
          {/* User Management Quick Table */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Users size={20} className="header-icon" />
                <h3>Recent Campus Users</h3>
              </div>
              <Link to="/admin/users" className="card-header-action">
                All Users ({users.length}) <ChevronRight size={16} />
              </Link>
            </div>

            <div className="admin-user-table-wrapper">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="table-user-cell">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.name}
                            className="table-avatar"
                          />
                          <div>
                            <span className="table-user-name">{u.name}</span>
                            <span className="table-user-email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-tag role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className="text-secondary text-sm">{u.department}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-sm"
                          onClick={() => navigate('/admin/users')}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campus Events Quick View */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Calendar size={20} className="header-icon" />
                <h3>Campus Events & Registrations</h3>
              </div>
              <Link to="/admin/events" className="card-header-action">
                Manage Events <ChevronRight size={16} />
              </Link>
            </div>

            <div className="events-summary-list">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="event-summary-item">
                  <div className="event-date-badge">
                    <span className="event-badge-month">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="event-badge-day">
                      {new Date(evt.date).getDate()}
                    </span>
                  </div>

                  <div className="event-info-col">
                    <h4 className="event-title-text">{evt.title}</h4>
                    <p className="event-meta-line">{evt.venue} • Organized by {evt.organizer}</p>
                  </div>

                  <div className="event-action-col">
                    <span className="status-badge status-info">
                      {evt.registeredUserIds?.length || 0} / {evt.capacity} Registered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Activity Log & Announcements */}
        <div className="dashboard-col">
          {/* Live Platform Activity Log */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Activity size={20} className="header-icon" />
                <h3>Recent Platform Audit Trail</h3>
              </div>
              <Link to="/admin/system" className="card-header-action">
                Full Log <ChevronRight size={16} />
              </Link>
            </div>

            <div className="activity-timeline">
              {activities.slice(0, 6).map((act) => (
                <div key={act.id} className="activity-timeline-item">
                  <div className={`activity-indicator role-dot-${act.role}`} />
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-user">{act.user}</span>
                      <span className={`role-tag-sm role-${act.role}`}>{act.role}</span>
                      <span className="activity-time">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="activity-action-name">{act.action}</p>
                    <p className="activity-details">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Announcement Publisher */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Bell size={20} className="header-icon" />
                <h3>University Announcements</h3>
              </div>
              <Link to="/admin/announcements" className="card-header-action">
                Manage All ({announcements.length}) <ChevronRight size={16} />
              </Link>
            </div>

            <div className="announcements-summary-list">
              {announcements.slice(0, 3).map((anc) => (
                <div key={anc.id} className="anc-summary-item">
                  <div className="anc-item-header">
                    <span className={`category-tag category-${anc.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {anc.category}
                    </span>
                    <span className="anc-date">{anc.date}</span>
                  </div>
                  <h4 className="anc-title">{anc.title}</h4>
                  <p className="anc-desc-snippet">{anc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Resetting Mock Data */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Demonstration Data?"
        message="This will restore all default mock students, faculty, courses, events, and assignments back to their initial baseline. Any demo data you created will be reset."
        confirmText="Reset Everything"
        cancelText="Keep My Data"
        danger={true}
      />
    </div>
  );
};
