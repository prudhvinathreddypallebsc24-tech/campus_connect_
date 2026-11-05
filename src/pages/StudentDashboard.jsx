import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Bell,
  FileCheck2,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/StatCard';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const userCourses = storageService.getCoursesForStudent(user.id);
    const allEvents = storageService.getEvents();
    const allAncs = storageService.getAnnouncements();
    const userAssignments = storageService.getAssignmentsForStudent(user.id);

    setCourses(userCourses);
    setEvents(allEvents);
    setAnnouncements(allAncs);
    setAssignments(userAssignments);
  };

  const registeredEvents = events.filter((e) =>
    e.registeredUserIds && e.registeredUserIds.includes(user?.id)
  );

  const pendingAssignments = assignments.filter((a) => {
    const sub = a.submissions?.find((s) => s.studentId === user?.id);
    return !sub || sub.status !== 'Submitted';
  });

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text-col">
          <div className="welcome-tag">
            <Sparkles size={16} />
            <span>Academic Session 2026 • Fall Term</span>
          </div>
          <h1 className="welcome-title">
            Welcome back, <span className="text-highlight">{user?.name}</span>!
          </h1>
          <p className="welcome-subtitle">
            You are enrolled in {courses.length} courses this semester. You have {pendingAssignments.length} pending assignment{pendingAssignments.length === 1 ? '' : 's'} and {registeredEvents.length} upcoming campus event{registeredEvents.length === 1 ? '' : 's'}.
          </p>

          <div className="welcome-actions">
            <Link to="/student/assignments" className="btn btn-primary">
              <FileCheck2 size={16} />
              <span>Submit Assignments</span>
            </Link>
            <Link to="/student/events" className="btn btn-secondary">
              <Calendar size={16} />
              <span>Browse Events</span>
            </Link>
          </div>
        </div>

        {/* Profile Card Snippet */}
        <div className="welcome-profile-snippet">
          <div className="profile-snippet-header">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="snippet-avatar"
            />
            <div>
              <h4 className="snippet-name">{user?.name}</h4>
              <span className="snippet-id">ID: {user?.studentId || 'CS-2023-049'}</span>
            </div>
          </div>
          <div className="profile-snippet-details">
            <div className="detail-row">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{user?.department}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Current Term:</span>
              <span className="detail-value">{user?.semester || '5th Semester'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">CGPA Standing:</span>
              <span className="detail-value text-accent-green font-bold">
                {user?.cgpa || '3.82 / 4.00'}
              </span>
            </div>
          </div>
          <Link to="/student/profile" className="snippet-link">
            Edit Profile Information <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-cards-grid">
        <StatCard
          title="Enrolled Courses"
          value={courses.length}
          icon={BookOpen}
          subtitle="Full-time enrollment (14 Credits)"
          badgeText="Active"
          badgeType="success"
          accentColor="navy"
          onClick={() => navigate('/student/courses')}
        />
        <StatCard
          title="Upcoming Campus Events"
          value={events.length}
          icon={Calendar}
          subtitle={`${registeredEvents.length} registered by you`}
          badgeText={registeredEvents.length > 0 ? `${registeredEvents.length} Registered` : 'Explore'}
          badgeType="info"
          accentColor="green"
          onClick={() => navigate('/student/events')}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          icon={FileCheck2}
          subtitle={pendingAssignments.length > 0 ? 'Due within 14 days' : 'All caught up!'}
          badgeText={pendingAssignments.length > 0 ? 'Action Needed' : 'Completed'}
          badgeType={pendingAssignments.length > 0 ? 'warning' : 'success'}
          accentColor="amber"
          onClick={() => navigate('/student/assignments')}
        />
        <StatCard
          title="Campus Announcements"
          value={announcements.length}
          icon={Bell}
          subtitle="Latest updates from faculty & dean"
          badgeText="New Updates"
          badgeType="info"
          accentColor="purple"
          onClick={() => navigate('/student/announcements')}
        />
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Enrolled Courses & Assignments */}
        <div className="dashboard-col">
          {/* Enrolled Courses Card */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <BookOpen size={20} className="header-icon" />
                <h3>My Current Courses</h3>
              </div>
              <Link to="/student/courses" className="card-header-action">
                View All ({courses.length}) <ChevronRight size={16} />
              </Link>
            </div>

            <div className="course-card-list">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="course-item-row">
                  <div className="course-badge-box">
                    <span className="course-code-tag">{course.code}</span>
                    <span className="course-credits">{course.credits} Credits</span>
                  </div>

                  <div className="course-info-col">
                    <h4 className="course-title-text">{course.name}</h4>
                    <p className="course-instructor-text">
                      Instructor: <span className="font-medium">{course.facultyName}</span>
                    </p>
                    <div className="course-meta-tags">
                      <span className="meta-tag">
                        <Clock size={12} /> {course.schedule}
                      </span>
                      <span className="meta-tag">
                        <MapPin size={12} /> {course.room}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-sm"
                    onClick={() => navigate('/student/courses')}
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Course Assignments Card */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <FileCheck2 size={20} className="header-icon" />
                <h3>Assignments & Project Milestones</h3>
              </div>
              <Link to="/student/assignments" className="card-header-action">
                Manage All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="assignment-dashboard-list">
              {assignments.slice(0, 3).map((asg) => {
                const mySub = asg.submissions?.find((s) => s.studentId === user?.id);
                const isSubmitted = mySub && mySub.status === 'Submitted';

                return (
                  <div key={asg.id} className="assignment-item-box">
                    <div className="assignment-item-header">
                      <span className="asg-course-pill">{asg.courseCode}</span>
                      {isSubmitted ? (
                        <span className="status-badge status-success">
                          <CheckCircle2 size={12} /> Submitted {mySub.grade ? `(${mySub.grade})` : ''}
                        </span>
                      ) : (
                        <span className="status-badge status-warning">
                          <Clock size={12} /> Pending Submission
                        </span>
                      )}
                    </div>

                    <h4 className="asg-title">{asg.title}</h4>
                    <p className="asg-desc-preview">{asg.description}</p>

                    <div className="asg-item-footer">
                      <span className="asg-deadline">
                        Due: {new Date(asg.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      <button
                        className={`btn ${isSubmitted ? 'btn-secondary-sm' : 'btn-primary-sm'}`}
                        onClick={() => navigate('/student/assignments')}
                      >
                        {isSubmitted ? 'View Submission' : 'Submit Work'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Latest Announcements & Events */}
        <div className="dashboard-col">
          {/* Latest Announcements */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Bell size={20} className="header-icon" />
                <h3>Latest Announcements</h3>
              </div>
              <Link to="/student/announcements" className="card-header-action">
                All Announcements <ChevronRight size={16} />
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
                  <div className="anc-author-line">
                    <span>Posted by {anc.authorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Calendar size={20} className="header-icon" />
                <h3>Upcoming Events & Workshops</h3>
              </div>
              <Link to="/student/events" className="card-header-action">
                Event Calendar <ChevronRight size={16} />
              </Link>
            </div>

            <div className="events-summary-list">
              {events.slice(0, 3).map((evt) => {
                const isRegistered = evt.registeredUserIds?.includes(user?.id);
                return (
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
                      <p className="event-meta-line">
                        <MapPin size={12} /> {evt.venue}
                      </p>
                      <span className="event-time-line">
                        <Clock size={12} /> {evt.time}
                      </span>
                    </div>

                    <div className="event-action-col">
                      {isRegistered ? (
                        <span className="status-badge status-success">Registered</span>
                      ) : (
                        <button
                          className="btn btn-outline-sm"
                          onClick={() => navigate('/student/events')}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
