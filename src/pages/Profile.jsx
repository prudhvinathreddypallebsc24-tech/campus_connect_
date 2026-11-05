import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [office, setOffice] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDepartment(user.department || '');
      setSemester(user.semester || '5th Semester');
      setOffice(user.office || '');
      setOfficeHours(user.officeHours || '');
      setTitle(user.title || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    const updates = {
      name: name.trim(),
      phone: phone.trim(),
      department,
      avatar,
      ...(user.role === 'student' && { semester }),
      ...(user.role === 'faculty' && { office, officeHours, title }),
      ...(user.role === 'admin' && { title })
    };

    updateProfile(updates);
    showToast('Profile information updated successfully!', 'success');
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">Personal Profile & Academic Identity</h2>
          <p className="page-sub-title">
            Manage your personal contact details, campus credentials, and department affiliations.
          </p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left ID Badge Card */}
        <div className="profile-badge-card">
          <div className="profile-badge-header">
            <span className="badge-univ-title">APEX STATE UNIVERSITY</span>
            <span className="badge-official-seal">OFFICIAL ID</span>
          </div>

          <div className="profile-badge-avatar-wrap">
            <img src={avatar || sampleAvatars[0]} alt={name} className="profile-large-avatar" />
            <span className={`profile-badge-role-pill role-${user?.role}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>

          <div className="profile-badge-info">
            <h3 className="profile-badge-name">{name}</h3>
            <p className="profile-badge-id">
              ID: {user?.studentId || user?.facultyId || user?.adminId || 'ID-001'}
            </p>
            <p className="profile-badge-dept">{department}</p>
          </div>

          <div className="profile-badge-meta-box">
            <div className="badge-meta-row">
              <span>Status:</span>
              <strong className="text-accent-green">Active Enrolled</strong>
            </div>
            <div className="badge-meta-row">
              <span>Email:</span>
              <span>{email}</span>
            </div>
            <div className="badge-meta-row">
              <span>Issued:</span>
              <span>Fall 2026</span>
            </div>
          </div>

          <div className="avatar-selection-box">
            <span className="avatar-selection-label">Select Avatar Preset:</span>
            <div className="avatar-preset-row">
              {sampleAvatars.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preset-${idx}`}
                  className={`avatar-preset-thumb ${avatar === url ? 'active-preset' : ''}`}
                  onClick={() => setAvatar(url)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Edit Form Card */}
        <div className="portal-card profile-form-card">
          <div className="portal-card-header">
            <div className="card-header-title">
              <User size={20} className="header-icon" />
              <h3>Edit Profile Information</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-name">
                  Full Name *
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="prof-name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-email">
                  Institutional Email (Read Only)
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="prof-email"
                    type="email"
                    className="form-input disabled-input"
                    value={email}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-phone">
                  Phone Number
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    id="prof-phone"
                    type="text"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-dept">
                  Department
                </label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <input
                    id="prof-dept"
                    type="text"
                    className="form-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Student Specific Fields */}
            {user?.role === 'student' && (
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="prof-sem">
                    Current Semester
                  </label>
                  <select
                    id="prof-sem"
                    className="form-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Cumulative GPA</label>
                  <input
                    type="text"
                    className="form-input disabled-input"
                    value={user.cgpa || '3.82 / 4.00'}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Faculty Specific Fields */}
            {user?.role === 'faculty' && (
              <>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="prof-title">
                      Academic Title
                    </label>
                    <input
                      id="prof-title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Associate Professor & Chair"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label" htmlFor="prof-office">
                      Office Location
                    </label>
                    <div className="input-with-icon">
                      <MapPin size={18} className="input-icon" />
                      <input
                        id="prof-office"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Engineering Block B, Room 412"
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prof-hours">
                    Student Office Hours
                  </label>
                  <div className="input-with-icon">
                    <Clock size={18} className="input-icon" />
                    <input
                      id="prof-hours"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mon & Wed, 2:00 PM - 4:30 PM"
                      value={officeHours}
                      onChange={(e) => setOfficeHours(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Admin Specific Fields */}
            {user?.role === 'admin' && (
              <div className="form-group">
                <label className="form-label" htmlFor="prof-admin-title">
                  Executive Administrative Role
                </label>
                <input
                  id="prof-admin-title"
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            )}

            <div className="profile-submit-row">
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
