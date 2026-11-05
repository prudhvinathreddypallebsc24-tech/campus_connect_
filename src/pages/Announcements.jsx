import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  User,
  Tag,
  Pin,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Announcements = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState('normal');

  // Delete dialog state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const canManage = user?.role === 'admin' || user?.role === 'faculty';

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    setAnnouncements(storageService.getAnnouncements());
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCategory('Academic');
    setPriority('normal');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setPriority(item.priority || 'normal');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Announcement title is required', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Announcement content is required', 'error');
      return;
    }

    if (editingItem) {
      storageService.updateAnnouncement(editingItem.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority
      });
      showToast('Announcement updated successfully', 'success');
    } else {
      storageService.addAnnouncement({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        authorName: user.name,
        authorRole: user.role
      });
      showToast('Announcement broadcasted successfully', 'success');
    }

    setIsModalOpen(false);
    loadAnnouncements();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      storageService.deleteAnnouncement(deleteTargetId);
      showToast('Announcement removed', 'info');
      setDeleteTargetId(null);
      loadAnnouncements();
    }
  };

  const categories = ['All', 'Academic', 'Campus Life', 'Examination', 'Administration', 'Career'];

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">Campus Announcements</h2>
          <p className="page-sub-title">
            Official university bulletins, academic deadlines, departmental advisories, and campus notices.
          </p>
        </div>

        {canManage && (
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-card">
        <div className="filter-search-box">
          <Search size={18} className="filter-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search announcements by keywords or author..."
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
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="announcements-full-grid">
        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state-card">
            <Bell size={48} className="empty-state-icon" />
            <h3>No Announcements Found</h3>
            <p>There are no announcements matching your current search or category filters.</p>
            {canManage && (
              <button className="btn btn-primary mt-3" onClick={handleOpenCreateModal}>
                <Plus size={16} /> Post an Announcement
              </button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className={`announcement-detailed-card ${item.pinned ? 'card-pinned' : ''}`}
            >
              <div className="anc-card-top-bar">
                <div className="anc-badges-group">
                  <span className={`category-tag category-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.category}
                  </span>
                  {item.priority === 'high' && (
                    <span className="priority-badge-high">High Priority</span>
                  )}
                  {item.pinned && (
                    <span className="pinned-badge">
                      <Pin size={12} /> Pinned Notice
                    </span>
                  )}
                </div>

                {canManage && (
                  <div className="anc-actions-group">
                    <button
                      className="icon-action-btn"
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit announcement"
                      aria-label="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-action-btn delete-btn"
                      onClick={() => setDeleteTargetId(item.id)}
                      title="Delete announcement"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="anc-card-title">{item.title}</h3>
              <p className="anc-card-body">{item.description}</p>

              <div className="anc-card-footer">
                <div className="anc-author-info">
                  <User size={14} />
                  <span>By {item.authorName} ({item.authorRole})</span>
                </div>
                <div className="anc-date-info">
                  <Calendar size={14} />
                  <span>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Announcement' : 'Publish New Announcement'}
        subtitle="This bulletin will be visible across student and faculty dashboards."
      >
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="anc-title">
              Announcement Title *
            </label>
            <input
              id="anc-title"
              type="text"
              className="form-input"
              placeholder="e.g. Midterm Examination Timetable Published"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="anc-category">
                Category
              </label>
              <select
                id="anc-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Examination">Examination</option>
                <option value="Administration">Administration</option>
                <option value="Career">Career</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="anc-priority">
                Urgency Level
              </label>
              <select
                id="anc-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="normal">Standard Notice</option>
                <option value="medium">Important</option>
                <option value="high">Urgent / High Priority</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="anc-desc">
              Announcement Details *
            </label>
            <textarea
              id="anc-desc"
              rows={5}
              className="form-textarea"
              placeholder="Provide complete details, instructions, room numbers, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
              {editingItem ? 'Save Changes' : 'Broadcast Announcement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement?"
        message="Are you sure you want to delete this campus announcement? It will be removed immediately from all student and staff portals."
        confirmText="Yes, Delete Announcement"
      />
    </div>
  );
};
