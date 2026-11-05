import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Bell,
  Calendar,
  BookOpen,
  FileCheck2,
  Users,
  ShieldAlert,
  User,
  LogOut,
  ChevronRight,
  ExternalLink,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully', 'info');
    navigate('/login');
  };

  const getNavItems = () => {
    if (user.role === 'student') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Announcements', path: '/student/announcements', icon: Bell },
        { name: 'Campus Events', path: '/student/events', icon: Calendar },
        { name: 'Enrolled Courses', path: '/student/courses', icon: BookOpen },
        { name: 'Assignments', path: '/student/assignments', icon: FileCheck2 },
        { name: 'My Profile', path: '/student/profile', icon: User }
      ];
    } else if (user.role === 'faculty') {
      return [
        { name: 'Overview', path: '/faculty/dashboard', icon: LayoutDashboard },
        { name: 'Manage Courses', path: '/faculty/courses', icon: BookOpen },
        { name: 'Assignments', path: '/faculty/assignments', icon: FileCheck2 },
        { name: 'Announcements', path: '/faculty/announcements', icon: Bell },
        { name: 'Events & Calendar', path: '/faculty/events', icon: Calendar },
        { name: 'Faculty Profile', path: '/faculty/profile', icon: User }
      ];
    } else if (user.role === 'admin') {
      return [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Event Hub', path: '/admin/events', icon: Calendar },
        { name: 'Announcements', path: '/admin/announcements', icon: Bell },
        { name: 'Course Catalog', path: '/admin/courses', icon: BookMarked },
        { name: 'System Activity', path: '/admin/system', icon: ShieldAlert },
        { name: 'Admin Profile', path: '/admin/profile', icon: User }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return <span className="role-tag role-student">Student</span>;
      case 'faculty':
        return <span className="role-tag role-faculty">Faculty</span>;
      case 'admin':
        return <span className="role-tag role-admin">Administrator</span>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`portal-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <GraduationCap className="brand-logo-icon" size={28} />
          </div>
          <div className="brand-text">
            <h2 className="brand-title">CAMPUS CONNECT</h2>
            <span className="brand-tagline">University Portal</span>
          </div>
        </div>

        {/* User Mini Banner */}
        <div className="sidebar-user-card">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="sidebar-avatar"
          />
          <div className="sidebar-user-info">
            <h4 className="sidebar-user-name" title={user.name}>
              {user.name}
            </h4>
            <div className="sidebar-role-row">
              {getRoleBadge(user.role)}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav-section">
          <span className="sidebar-section-title">MAIN NAVIGATION</span>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                  onClick={() => {
                    if (window.innerWidth < 992) onClose();
                  }}
                >
                  <Icon size={19} className="sidebar-link-icon" />
                  <span className="sidebar-link-label">{item.name}</span>
                  <ChevronRight size={14} className="sidebar-chevron" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* University Info Card */}
        <div className="sidebar-quick-info">
          <div className="sidebar-info-header">
            <span className="info-title">Term Status</span>
            <span className="info-pill">Active</span>
          </div>
          <p className="sidebar-info-desc">Fall Semester 2026</p>
          <div className="sidebar-info-sub">Week 10 • Midterms Active</div>
        </div>

        {/* Logout Bottom Footer */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Log out of your session"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
