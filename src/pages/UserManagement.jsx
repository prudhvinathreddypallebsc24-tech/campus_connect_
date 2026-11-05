import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Briefcase,
  Shield,
  Mail,
  Phone,
  Building,
  Hash,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [title, setTitle] = useState('');

  // Delete dialog state
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(storageService.getUsers());
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('demo123');
    setRole('student');
    setDepartment('Computer Science & Engineering');
    setPhone('+1 (555) 000-1122');
    setIdentifier(`ID-${Math.floor(1000 + Math.random() * 9000)}`);
    setTitle('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword(u.password || 'demo123');
    setRole(u.role);
    setDepartment(u.department || 'Computer Science & Engineering');
    setPhone(u.phone || '');
    setIdentifier(u.studentId || u.facultyId || u.adminId || '');
    setTitle(u.title || '');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    if (editingUser) {
      storageService.updateUser(editingUser.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department,
        phone,
        studentId: role === 'student' ? identifier : undefined,
        facultyId: role === 'faculty' ? identifier : undefined,
        title: role !== 'student' ? title : undefined
      });
      showToast(`User ${name} updated successfully`, 'success');
    } else {
      const existing = storageService.getUserByEmail(email.trim());
      if (existing) {
        showToast('A user with this email address already exists', 'error');
        return;
      }

      storageService.addUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department,
        phone,
        studentId: role === 'student' ? identifier : undefined,
        facultyId: role === 'faculty' ? identifier : undefined,
        title: role !== 'student' ? title : undefined
      });
      showToast(`New ${role} user account created`, 'success');
    }

    setIsModalOpen(false);
    loadUsers();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetUser) {
      if (deleteTargetUser.id === currentUser?.id) {
        showToast('You cannot delete your own active administrator account!', 'error');
        setDeleteTargetUser(null);
        return;
      }

      storageService.deleteUser(deleteTargetUser.id);
      showToast(`User ${deleteTargetUser.name} deleted`, 'info');
      setDeleteTargetUser(null);
      loadUsers();
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchTerm.toLowerCase();
    const idStr = (u.studentId || u.facultyId || u.adminId || '').toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      idStr.includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">University User Directory</h2>
          <p className="page-sub-title">
            Central repository of enrolled students, instructional faculty, and campus administrators.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-card">
        <div className="filter-search-box">
          <Search size={18} className="filter-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search users by name, institutional email, or ID number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="filter-clear-btn" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        <div className="category-pills-list">
          {['all', 'student', 'faculty', 'admin'].map((r) => (
            <button
              key={r}
              className={`category-pill-btn ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="portal-card user-table-card">
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Campus User</th>
                <th>Institutional ID</th>
                <th>Role</th>
                <th>Department / Unit</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const idNumber = u.studentId || u.facultyId || u.adminId || 'ID Pending';

                  return (
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
                        <span className="table-id-tag">{idNumber}</span>
                      </td>

                      <td>
                        <span className={`role-tag role-${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <div className="dept-cell">
                          <span>{u.department}</span>
                          {u.title && <span className="dept-sub-title">{u.title}</span>}
                        </div>
                      </td>

                      <td>
                        <span className="text-secondary text-sm">{u.phone || 'N/A'}</span>
                      </td>

                      <td>
                        <div className="table-actions-row">
                          <button
                            className="icon-action-btn"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit user details"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="icon-action-btn delete-btn"
                            onClick={() => setDeleteTargetUser(u)}
                            title="Delete user"
                            disabled={u.id === currentUser?.id}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Register New Campus User'}
        subtitle="Credentials will be stored persistently in browser demonstration memory."
        maxWidth="550px"
      >
        <form onSubmit={handleSaveUser} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="user-name">
              Full Legal Name *
            </label>
            <input
              id="user-name"
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Arthur Pendelton"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="user-email">
                Institutional Email *
              </label>
              <input
                id="user-email"
                type="email"
                className="form-input"
                placeholder="user@campus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="user-pass">
                Password *
              </label>
              <input
                id="user-pass"
                type="text"
                className="form-input"
                placeholder="demo password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="user-role">
                Portal Role *
              </label>
              <select
                id="user-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="user-id-field">
                Identifier ID
              </label>
              <input
                id="user-id-field"
                type="text"
                className="form-input"
                placeholder="e.g. CS-2026-001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-dept">
              Academic Department / Administrative Division
            </label>
            <select
              id="user-dept"
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Office of Academic Affairs">Office of Academic Affairs</option>
              <option value="Student Affairs & Campus Life">Student Affairs & Campus Life</option>
            </select>
          </div>

          {role !== 'student' && (
            <div className="form-group">
              <label className="form-label" htmlFor="user-title">
                Academic Title / Designation
              </label>
              <input
                id="user-title"
                type="text"
                className="form-input"
                placeholder="e.g. Associate Professor & Lab Director"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="user-phone">
              Phone Number
            </label>
            <input
              id="user-phone"
              type="text"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Save User' : 'Create User Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetUser}
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campus User Account?"
        message={`Are you sure you want to remove ${deleteTargetUser?.name} (${deleteTargetUser?.email})? All associated records will be removed.`}
        confirmText="Yes, Delete User"
      />
    </div>
  );
};
