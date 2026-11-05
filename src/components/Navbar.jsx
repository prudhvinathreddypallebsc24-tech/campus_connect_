import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ courses: [], events: [], announcements: [] });

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const announcements = storageService.getAnnouncements();
  const unreadCount = announcements.slice(0, 3).length;

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle global search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ courses: [], events: [], announcements: [] });
      setSearchResultsOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const courses = storageService.getCourses().filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
    const events = storageService.getEvents().filter(
      (e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
    );
    const ancs = storageService.getAnnouncements().filter(
      (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );

    setSearchResults({
      courses: courses.slice(0, 3),
      events: events.slice(0, 3),
      announcements: ancs.slice(0, 3)
    });
    setSearchResultsOpen(true);
  }, [searchQuery]);

  const handleQuickSwitch = async (role) => {
    let creds = { email: 'student@campus.com', pass: 'student123' };
    if (role === 'faculty') creds = { email: 'faculty@campus.com', pass: 'faculty123' };
    if (role === 'admin') creds = { email: 'admin@campus.com', pass: 'admin123' };

    const res = await login(creds.email, creds.pass, role);
    if (res.success) {
      showToast(`Switched to demo ${role.toUpperCase()} account`, 'success');
      navigate(`/${role}/dashboard`);
      setProfileDropdownOpen(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/announcements')) return 'Campus Announcements';
    if (path.includes('/events')) return 'Events & Activities';
    if (path.includes('/courses')) return 'Academic Courses';
    if (path.includes('/assignments')) return 'Assignments & Submissions';
    if (path.includes('/users')) return 'User Management Directory';
    if (path.includes('/system')) return 'System Diagnostics & Audit';
    if (path.includes('/profile')) return 'Personal Profile Settings';
    return 'Campus Portal';
  };

  return (
    <header className="portal-navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-title-wrap">
          <h1 className="navbar-title">{getPageTitle()}</h1>
          <span className="navbar-university-name">Apex State University • Portal</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="navbar-search-wrapper" ref={searchRef}>
        <div className="navbar-search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search courses, campus events, announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setSearchResultsOpen(true)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => {
                setSearchQuery('');
                setSearchResultsOpen(false);
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {searchResultsOpen && (
          <div className="search-results-dropdown shadow-lg">
            {searchResults.courses.length === 0 &&
            searchResults.events.length === 0 &&
            searchResults.announcements.length === 0 ? (
              <div className="search-empty">No results found for "{searchQuery}"</div>
            ) : (
              <div className="search-results-content">
                {searchResults.courses.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-title">
                      <BookOpen size={14} /> Courses
                    </div>
                    {searchResults.courses.map((c) => (
                      <div
                        key={c.id}
                        className="search-item"
                        onClick={() => {
                          setSearchResultsOpen(false);
                          setSearchQuery('');
                          navigate(`/${user.role}/courses`);
                        }}
                      >
                        <span className="search-item-badge">{c.code}</span>
                        <div className="search-item-details">
                          <p className="search-item-name">{c.name}</p>
                          <span className="search-item-sub">{c.facultyName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.events.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-title">
                      <Calendar size={14} /> Events
                    </div>
                    {searchResults.events.map((e) => (
                      <div
                        key={e.id}
                        className="search-item"
                        onClick={() => {
                          setSearchResultsOpen(false);
                          setSearchQuery('');
                          navigate(`/${user.role}/events`);
                        }}
                      >
                        <div className="search-item-details">
                          <p className="search-item-name">{e.title}</p>
                          <span className="search-item-sub">{e.date} • {e.venue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.announcements.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-title">
                      <Bell size={14} /> Announcements
                    </div>
                    {searchResults.announcements.map((a) => (
                      <div
                        key={a.id}
                        className="search-item"
                        onClick={() => {
                          setSearchResultsOpen(false);
                          setSearchQuery('');
                          navigate(`/${user.role}/announcements`);
                        }}
                      >
                        <div className="search-item-details">
                          <p className="search-item-name">{a.title}</p>
                          <span className="search-item-sub">{a.category} • {a.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navbar Right Actions */}
      <div className="navbar-right">
        {/* Quick Demo Switcher Pill */}
        <div className="demo-switch-group">
          <span className="demo-label">Demo:</span>
          <button
            className={`demo-btn ${user.role === 'student' ? 'demo-btn-active' : ''}`}
            onClick={() => handleQuickSwitch('student')}
            title="Switch to Student Account"
          >
            Student
          </button>
          <button
            className={`demo-btn ${user.role === 'faculty' ? 'demo-btn-active' : ''}`}
            onClick={() => handleQuickSwitch('faculty')}
            title="Switch to Faculty Account"
          >
            Faculty
          </button>
          <button
            className={`demo-btn ${user.role === 'admin' ? 'demo-btn-active' : ''}`}
            onClick={() => handleQuickSwitch('admin')}
            title="Switch to Admin Account"
          >
            Admin
          </button>
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="nav-dropdown-wrap" ref={notifRef}>
          <button
            className="nav-icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="notification-dropdown shadow-lg">
              <div className="notification-dropdown-header">
                <h3>Campus Notifications</h3>
                <span className="notification-pill-count">{unreadCount} New</span>
              </div>
              <div className="notification-list">
                {announcements.slice(0, 4).map((anc) => (
                  <div
                    key={anc.id}
                    className="notification-item"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate(`/${user.role}/announcements`);
                    }}
                  >
                    <div className="notification-dot" />
                    <div className="notification-text">
                      <p className="notification-title">{anc.title}</p>
                      <span className="notification-meta">
                        {anc.category} • {anc.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button
                  className="notification-view-all-btn"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate(`/${user.role}/announcements`);
                  }}
                >
                  View all announcements <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="nav-dropdown-wrap" ref={profileRef}>
          <button
            className="user-profile-trigger"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="nav-avatar"
            />
            <div className="nav-user-text">
              <span className="nav-user-name">{user.name}</span>
              <span className="nav-user-role-label">{user.role}</span>
            </div>
            <ChevronDown size={14} className="nav-chevron" />
          </button>

          {profileDropdownOpen && (
            <div className="profile-dropdown shadow-lg">
              <div className="profile-dropdown-header">
                <p className="profile-dropdown-name">{user.name}</p>
                <p className="profile-dropdown-email">{user.email}</p>
                <span className="profile-role-tag">{user.role.toUpperCase()}</span>
              </div>

              <div className="profile-dropdown-menu">
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(`/${user.role}/profile`);
                  }}
                >
                  <User size={16} />
                  <span>My Profile & Settings</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-menu-item text-danger"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                    showToast('Logged out successfully', 'info');
                    navigate('/login');
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
