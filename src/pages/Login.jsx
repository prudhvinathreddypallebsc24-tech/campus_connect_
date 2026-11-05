import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  UserCheck,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFillDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'student') {
      setEmail('student@campus.com');
      setPassword('student123');
    } else if (demoRole === 'faculty') {
      setEmail('faculty@campus.com');
      setPassword('faculty123');
    } else if (demoRole === 'admin') {
      setEmail('admin@campus.com');
      setPassword('admin123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, role);

    setLoading(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setError(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* Left University Branding Panel */}
        <div className="auth-side-panel">
          <div className="auth-side-header">
            <div className="auth-logo-circle">
              <GraduationCap size={32} />
            </div>
            <div>
              <h2>CAMPUS CONNECT</h2>
              <p>Apex State University</p>
            </div>
          </div>

          <div className="auth-side-content">
            <h3>Centralized Campus Operations & Academic Network</h3>
            <p>
              Access courses, academic announcements, faculty advisement, interactive event registrations, and campus services through a unified university hub.
            </p>

            <div className="auth-highlights">
              <div className="highlight-item">
                <CheckCircle size={18} />
                <span>Unified student, faculty, and administrator workspace</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={18} />
                <span>Real-time course announcements & event registrations</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={18} />
                <span>Assignment workflows and academic record tracking</span>
              </div>
            </div>
          </div>

          <div className="auth-side-footer">
            <div className="demo-notice-tag">
              <Info size={16} />
              <span>Demonstration environment with persistent browser storage</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your institutional credentials and select your campus role</p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="demo-accounts-box">
            <span className="demo-accounts-title">
              <ShieldCheck size={14} /> Quick Demo Accounts (Click to autofill):
            </span>
            <div className="demo-btn-row">
              <button
                type="button"
                className={`demo-pill ${role === 'student' && email === 'student@campus.com' ? 'active' : ''}`}
                onClick={() => handleFillDemo('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`demo-pill ${role === 'faculty' && email === 'faculty@campus.com' ? 'active' : ''}`}
                onClick={() => handleFillDemo('faculty')}
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                className={`demo-pill ${role === 'admin' && email === 'admin@campus.com' ? 'active' : ''}`}
                onClick={() => handleFillDemo('admin')}
              >
                🏛️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Select Institutional Role</label>
              <div className="role-selector-grid">
                <label className={`role-option-card ${role === 'student' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-option-content">
                    <strong>Student</strong>
                    <span>Learner Portal</span>
                  </div>
                </label>

                <label className={`role-option-card ${role === 'faculty' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={role === 'faculty'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-option-content">
                    <strong>Faculty</strong>
                    <span>Instructor Portal</span>
                  </div>
                </label>

                <label className={`role-option-card ${role === 'admin' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="role-option-content">
                    <strong>Admin</strong>
                    <span>University Staff</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Institutional Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. student@campus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-with-hint">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <span className="form-hint">Demo default: student123 / faculty123 / admin123</span>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              New to Campus Connect?{' '}
              <Link to="/register" className="auth-link">
                Register a new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
