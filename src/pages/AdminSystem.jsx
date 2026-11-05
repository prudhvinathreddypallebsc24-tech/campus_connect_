import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  Activity,
  Server,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/StatCard';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const AdminSystem = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isResetOpen, setIsResetOpen] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    setActivities(storageService.getActivities());
  };

  const handleResetData = () => {
    storageService.resetAllData();
    loadActivities();
    showToast('Platform data reset to baseline mock data', 'success');
  };

  const filteredActivities = activities.filter((act) => {
    const matchesRole = roleFilter === 'all' || act.role === roleFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      act.action.toLowerCase().includes(q) ||
      act.details.toLowerCase().includes(q) ||
      act.user.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">System Overview & Audit Activity</h2>
          <p className="page-sub-title">
            Portal operational diagnostics, platform events, security audits, and demonstration data controls.
          </p>
        </div>

        <button className="btn btn-danger" onClick={() => setIsResetOpen(true)}>
          <RefreshCw size={16} />
          <span>Reset All Mock Data</span>
        </button>
      </div>

      {/* Diagnostics Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Audit Trail Logs"
          value={activities.length}
          icon={Activity}
          subtitle="Recent state mutations"
          badgeText="Active Logging"
          badgeType="success"
          accentColor="navy"
        />
        <StatCard
          title="Storage Provider"
          value="HTML5 LocalStorage"
          icon={Database}
          subtitle="Key-Value JSON Store"
          badgeText="Synchronized"
          badgeType="info"
          accentColor="green"
        />
        <StatCard
          title="Runtime Engine"
          value="Vite 6 + React 18"
          icon={Server}
          subtitle="Single Page App Architecture"
          badgeText="Client-Side"
          badgeType="default"
          accentColor="purple"
        />
        <StatCard
          title="Platform Status"
          value="100% Operational"
          icon={CheckCircle2}
          subtitle="All service layers responding"
          badgeText="Healthy"
          badgeType="success"
          accentColor="green"
        />
      </div>

      {/* Audit Log Table */}
      <div className="portal-card mt-4">
        <div className="portal-card-header">
          <div className="card-header-title">
            <Activity size={20} className="header-icon" />
            <h3>Complete Platform Audit Trail</h3>
          </div>
        </div>

        <div className="filter-bar-card shadow-none border-b">
          <div className="filter-search-box">
            <Search size={18} className="filter-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search activity by action, details, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-pills-list">
            {['all', 'student', 'faculty', 'admin'].map((r) => (
              <button
                key={r}
                className={`category-pill-btn ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Initiator</th>
                <th>Role</th>
                <th>Action Category</th>
                <th>Event Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty-cell">
                    No activity logs match the search query.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <span className="font-mono text-sm">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <strong className="text-navy">{act.user}</strong>
                    </td>
                    <td>
                      <span className={`role-tag role-${act.role}`}>{act.role}</span>
                    </td>
                    <td>
                      <span className="status-badge status-info">{act.action}</span>
                    </td>
                    <td>
                      <span className="text-secondary">{act.details}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Mock Data to Default?"
        message="This will reset all users, courses, assignments, events, announcements, and activity logs back to the initial mock data."
        confirmText="Confirm Reset"
      />
    </div>
  );
};
