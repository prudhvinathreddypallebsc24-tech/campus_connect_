import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Events = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Tech & Coding');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [organizer, setOrganizer] = useState('');

  // View attendees modal state
  const [viewingAttendeesEvent, setViewingAttendeesEvent] = useState(null);

  // Delete confirm dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const canManage = user?.role === 'admin' || user?.role === 'faculty';

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setEvents(storageService.getEvents());
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM - 12:00 PM');
    setVenue('Campus Auditorium');
    setCategory('Tech & Coding');
    setDescription('');
    setCapacity(150);
    setOrganizer(user.name);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setCategory(evt.category);
    setDescription(evt.description);
    setCapacity(evt.capacity || 100);
    setOrganizer(evt.organizer || user.name);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();

    if (!title.trim() || !venue.trim() || !date) {
      showToast('Please fill in all required event details', 'error');
      return;
    }

    if (editingEvent) {
      storageService.updateEvent(editingEvent.id, {
        title: title.trim(),
        date,
        time,
        venue: venue.trim(),
        category,
        description: description.trim(),
        capacity: Number(capacity),
        organizer: organizer.trim()
      });
      showToast('Event updated successfully', 'success');
    } else {
      storageService.addEvent({
        title: title.trim(),
        date,
        time,
        venue: venue.trim(),
        category,
        description: description.trim(),
        capacity: Number(capacity),
        organizer: organizer.trim()
      });
      showToast('Campus event created and published', 'success');
    }

    setIsModalOpen(false);
    loadEvents();
  };

  const handleToggleRegistration = (evt) => {
    if (!user) return;

    const isRegistered = evt.registeredUserIds && evt.registeredUserIds.includes(user.id);

    if (isRegistered) {
      const res = storageService.unregisterFromEvent(evt.id, user.id);
      if (res.success) {
        showToast(`Cancelled registration for "${evt.title}"`, 'info');
      }
    } else {
      if (evt.registeredUserIds && evt.registeredUserIds.length >= evt.capacity) {
        showToast('Sorry, this event has reached maximum capacity', 'warning');
        return;
      }
      const res = storageService.registerForEvent(evt.id, user.id);
      if (res.success) {
        showToast(`Successfully registered for "${evt.title}"! Confirmation saved.`, 'success');
      } else {
        showToast(res.message, 'warning');
      }
    }

    loadEvents();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      storageService.deleteEvent(deleteTargetId);
      showToast('Event cancelled and deleted', 'info');
      setDeleteTargetId(null);
      loadEvents();
    }
  };

  const categories = ['All', 'Tech & Coding', 'Workshop', 'Career Fair', 'Sports', 'Cultural'];

  const filteredEvents = events.filter((evt) => {
    const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">Campus Events & Workshops</h2>
          <p className="page-sub-title">
            Discover hackathons, guest lectures, career fairs, sports tournaments, and student club activities.
          </p>
        </div>

        {canManage && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Create New Event</span>
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
            placeholder="Search events by title, venue, or topic..."
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

      {/* Events Grid */}
      <div className="events-cards-grid">
        {filteredEvents.length === 0 ? (
          <div className="empty-state-card col-span-full">
            <Calendar size={48} className="empty-state-icon" />
            <h3>No Events Found</h3>
            <p>No campus events match your selected criteria.</p>
            {canManage && (
              <button className="btn btn-primary mt-3" onClick={handleOpenCreate}>
                <Plus size={16} /> Host a New Event
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isRegistered = evt.registeredUserIds && evt.registeredUserIds.includes(user?.id);
            const registeredCount = evt.registeredUserIds ? evt.registeredUserIds.length : 0;
            const isFull = registeredCount >= (evt.capacity || 100);

            return (
              <div key={evt.id} className="event-full-card">
                <div className="event-card-media">
                  <img
                    src={evt.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                    alt={evt.title}
                    className="event-banner-img"
                  />
                  <span className="event-media-category">{evt.category}</span>
                  {isRegistered && (
                    <span className="event-registered-banner">
                      <CheckCircle2 size={14} /> Registered
                    </span>
                  )}
                </div>

                <div className="event-card-main-content">
                  <div className="event-header-row">
                    <h3 className="event-card-heading">{evt.title}</h3>
                    {canManage && (
                      <div className="event-admin-actions">
                        <button
                          className="icon-action-btn"
                          onClick={() => handleOpenEdit(evt)}
                          title="Edit event"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="icon-action-btn delete-btn"
                          onClick={() => setDeleteTargetId(evt.id)}
                          title="Cancel/delete event"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="event-card-desc">{evt.description}</p>

                  <div className="event-meta-info-grid">
                    <div className="event-meta-item">
                      <Calendar size={16} className="event-meta-icon" />
                      <div>
                        <span className="meta-label">Date</span>
                        <span className="meta-val">
                          {new Date(evt.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="event-meta-item">
                      <Clock size={16} className="event-meta-icon" />
                      <div>
                        <span className="meta-label">Time</span>
                        <span className="meta-val">{evt.time}</span>
                      </div>
                    </div>

                    <div className="event-meta-item">
                      <MapPin size={16} className="event-meta-icon" />
                      <div>
                        <span className="meta-label">Location</span>
                        <span className="meta-val">{evt.venue}</span>
                      </div>
                    </div>

                    <div className="event-meta-item">
                      <Users size={16} className="event-meta-icon" />
                      <div>
                        <span className="meta-label">Registrations</span>
                        <span className="meta-val">
                          {registeredCount} / {evt.capacity || 100} Spots
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="event-card-bottom-bar">
                    <div className="organizer-text">
                      <span>Organized by: <strong>{evt.organizer || 'Campus Board'}</strong></span>
                    </div>

                    <div className="event-btn-group">
                      {canManage && (
                        <button
                          className="btn btn-secondary-sm"
                          onClick={() => setViewingAttendeesEvent(evt)}
                          title="View attendee roster"
                        >
                          <Eye size={14} /> Attendees ({registeredCount})
                        </button>
                      )}

                      {user?.role === 'student' && (
                        <button
                          className={`btn ${isRegistered ? 'btn-danger-outline' : 'btn-primary'}`}
                          onClick={() => handleToggleRegistration(evt)}
                          disabled={!isRegistered && isFull}
                        >
                          {isRegistered ? (
                            <>
                              <XCircle size={15} /> Cancel Registration
                            </>
                          ) : isFull ? (
                            'Event Full'
                          ) : (
                            <>
                              <CheckCircle2 size={15} /> Register Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Campus Event' : 'Create New Campus Event'}
        subtitle="Provide event logistical details and registration limits."
        maxWidth="600px"
      >
        <form onSubmit={handleSaveEvent} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="evt-title">
              Event Title *
            </label>
            <input
              id="evt-title"
              type="text"
              className="form-input"
              placeholder="e.g. Annual Autonomous Robotics Hackathon 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-date">
                Date *
              </label>
              <input
                id="evt-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-time">
                Time Window *
              </label>
              <input
                id="evt-time"
                type="text"
                className="form-input"
                placeholder="e.g. 10:00 AM - 04:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-venue">
                Venue / Hall *
              </label>
              <input
                id="evt-venue"
                type="text"
                className="form-input"
                placeholder="e.g. Turing Auditorium or Lab 3"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-category">
                Category
              </label>
              <select
                id="evt-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Tech & Coding">Tech & Coding</option>
                <option value="Workshop">Workshop</option>
                <option value="Career Fair">Career Fair</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-capacity">
                Capacity Limit (Seats)
              </label>
              <input
                id="evt-capacity"
                type="number"
                min="1"
                className="form-input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="evt-org">
                Organizing Entity / Club
              </label>
              <input
                id="evt-org"
                type="text"
                className="form-input"
                placeholder="e.g. IEEE Student Branch"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="evt-desc">
              Description & Highlights *
            </label>
            <textarea
              id="evt-desc"
              rows={4}
              className="form-textarea"
              placeholder="Provide event objectives, eligibility, speaker bios, or required equipment..."
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
              {editingEvent ? 'Save Event' : 'Publish Campus Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendees Roster Modal */}
      <Modal
        isOpen={!!viewingAttendeesEvent}
        onClose={() => setViewingAttendeesEvent(null)}
        title={`Registered Attendees: ${viewingAttendeesEvent?.title || ''}`}
        subtitle={`Total registered: ${viewingAttendeesEvent?.registeredUserIds?.length || 0} participants`}
        maxWidth="500px"
      >
        <div className="attendees-modal-content">
          {(!viewingAttendeesEvent?.registeredUserIds || viewingAttendeesEvent.registeredUserIds.length === 0) ? (
            <div className="empty-state-box">
              <Users size={32} />
              <p>No students have registered for this event yet.</p>
            </div>
          ) : (
            <div className="attendee-list">
              {viewingAttendeesEvent.registeredUserIds.map((userId) => {
                const attendee = storageService.getUserById(userId);
                return (
                  <div key={userId} className="attendee-item">
                    <img
                      src={attendee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={attendee?.name || 'Student'}
                      className="attendee-avatar"
                    />
                    <div className="attendee-info">
                      <span className="attendee-name">{attendee?.name || 'Registered Student'}</span>
                      <span className="attendee-sub">
                        {attendee?.studentId || 'ID Verified'} • {attendee?.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="modal-actions mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setViewingAttendeesEvent(null)}
            >
              Close Roster
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Event Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Campus Event?"
        message="Are you sure you want to cancel and remove this event? All current student registrations for this event will be invalidated."
        confirmText="Yes, Cancel Event"
      />
    </div>
  );
};
