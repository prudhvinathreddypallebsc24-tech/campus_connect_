import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Building,
  Hash,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name,
      email,
      password,
      role,
      department,
      studentId: role === 'student' ? identifier || `CS-2026-${Math.floor(100 + Math.random() * 900)}` : undefined,
      facultyId: role === 'faculty' ? identifier || `FAC-2026-${Math.floor(100 + Math.random() * 900)}` : undefined
    });

    setLoading(false);

    if (result.success) {
      showToast('Account registered successfully! Welcome to Campus Connect.', 'success');
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setError(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container register-card-container">
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
            <h3>Join the Academic Community</h3>
            <p>
              Create your unified campus credential to access schedules, enroll in campus clubs, view grade reports, and connect with faculty mentors.
            </p>
          </div>

          <div className="auth-side-footer">
            <div className="demo-notice-tag">
              <span>Demonstration Auth: Stores new demo accounts directly in browser localStorage.</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2>Create Your Campus Account</h2>
            <p>Register as a student, faculty member, or campus administrator</p>
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
              <label className="form-label">Select Your Role</label>
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
                    <span>Enrolled Learner</span>
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
                    <span>Academic Staff</span>
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
                    <span>Campus Staff</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Legal Name
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Institutional Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. j.smith@campus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              {/* Department */}
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="reg-dept">
                  Department
                </label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <select
                    id="reg-dept"
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil & Environmental">Civil & Environmental</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>
              </div>

              {/* ID Identifier */}
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="reg-id">
                  {role === 'student' ? 'Student ID' : role === 'faculty' ? 'Faculty ID' : 'Staff ID'}
                </label>
                <div className="input-with-icon">
                  <Hash size={18} className="input-icon" />
                  <input
                    id="reg-id"
                    type="text"
                    className="form-input"
                    placeholder={role === 'student' ? 'e.g. CS-2026-105' : 'e.g. FAC-2026-088'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">
                Password (minimum 6 characters)
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="reg-pass"
                  type="password"
                  className="form-input"
                  placeholder="Create a strong password"
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
                'Creating Account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
