import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  Bell,
  FileCheck2,
  PlusCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { StatCard } from '../components/StatCard';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const facultyCourses = storageService.getCoursesForFaculty(user.id);
    const facultyAssignments = storageService.getAssignmentsForFaculty(user.id);
    const allAncs = storageService.getAnnouncements();
    const allEvents = storageService.getEvents();

    setCourses(facultyCourses);
    setAssignments(facultyAssignments);
    setAnnouncements(allAncs);
    setEvents(allEvents);
  };

  // Calculate total students taught across all courses
  const totalEnrolledStudents = courses.reduce(
    (total, course) => total + (course.enrolledStudents ? course.enrolledStudents.length : 0),
    0
  );

  // Total submissions received
  const totalSubmissions = assignments.reduce(
    (total, asg) => total + (asg.submissions ? asg.submissions.length : 0),
    0
  );

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner faculty-banner">
        <div className="welcome-text-col">
          <div className="welcome-tag">
            <Sparkles size={16} />
            <span>Faculty Academic Workspace</span>
          </div>
          <h1 className="welcome-title">
            Welcome, <span className="text-highlight">{user?.name}</span>
          </h1>
          <p className="welcome-subtitle">
            {user?.title || 'Faculty Member'} • {user?.department}. You have {courses.length} active courses with {totalEnrolledStudents} total student enrollments.
          </p>

          <div className="welcome-actions">
            <Link to="/faculty/assignments" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create New Assignment</span>
            </Link>
            <Link to="/faculty/announcements" className="btn btn-secondary">
              <Bell size={16} />
              <span>Post Announcement</span>
            </Link>
          </div>
        </div>

        {/* Profile Card Snippet */}
        <div className="welcome-profile-snippet">
          <div className="profile-snippet-header">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="snippet-avatar"
            />
            <div>
              <h4 className="snippet-name">{user?.name}</h4>
              <span className="snippet-id">{user?.facultyId || 'FAC-ENG-108'}</span>
            </div>
          </div>
          <div className="profile-snippet-details">
            <div className="detail-row">
              <span className="detail-label">Designation:</span>
              <span className="detail-value">{user?.title || 'Associate Professor'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Office:</span>
              <span className="detail-value">{user?.office || 'Block B, Room 412'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Office Hours:</span>
              <span className="detail-value font-medium text-navy">
                {user?.officeHours || 'Mon & Wed 2-4:30 PM'}
              </span>
            </div>
          </div>
          <Link to="/faculty/profile" className="snippet-link">
            Edit Faculty Profile <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Faculty Metric Cards Grid */}
      <div className="stat-cards-grid">
        <StatCard
          title="Assigned Courses"
          value={courses.length}
          icon={BookOpen}
          subtitle="Active lectures this term"
          badgeText="Active Term"
          badgeType="success"
          accentColor="navy"
          onClick={() => navigate('/faculty/courses')}
        />
        <StatCard
          title="Total Students"
          value={totalEnrolledStudents}
          icon={Users}
          subtitle="Across your assigned courses"
          badgeText="Enrolled"
          badgeType="info"
          accentColor="green"
          onClick={() => navigate('/faculty/courses')}
        />
        <StatCard
          title="Assignments Created"
          value={assignments.length}
          icon={FileCheck2}
          subtitle={`${totalSubmissions} submissions submitted`}
          badgeText="Active Tasks"
          badgeType="warning"
          accentColor="amber"
          onClick={() => navigate('/faculty/assignments')}
        />
        <StatCard
          title="Upcoming Campus Events"
          value={events.length}
          icon={Calendar}
          subtitle="Department conferences & dates"
          badgeText="Calendar"
          badgeType="default"
          accentColor="purple"
          onClick={() => navigate('/faculty/events')}
        />
      </div>

      {/* Main Grid: Assigned Courses & Assignment Overview */}
      <div className="dashboard-grid-2col">
        {/* Left Column: My Courses */}
        <div className="dashboard-col">
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <BookOpen size={20} className="header-icon" />
                <h3>My Teaching Courses</h3>
              </div>
              <Link to="/faculty/courses" className="card-header-action">
                Manage Class Rosters <ChevronRight size={16} />
              </Link>
            </div>

            <div className="course-card-list">
              {courses.map((course) => (
                <div key={course.id} className="course-item-row">
                  <div className="course-badge-box">
                    <span className="course-code-tag">{course.code}</span>
                    <span className="course-credits">{course.credits} Credits</span>
                  </div>

                  <div className="course-info-col">
                    <h4 className="course-title-text">{course.name}</h4>
                    <p className="course-instructor-text">
                      Classroom: <span className="font-medium">{course.room}</span> • Schedule: <span className="font-medium">{course.schedule}</span>
                    </p>
                    <div className="course-meta-tags">
                      <span className="meta-tag badge-tag-green">
                        <Users size={12} /> {course.enrolledStudents ? course.enrolledStudents.length : 0} Enrolled Students
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-sm"
                    onClick={() => navigate('/faculty/courses')}
                  >
                    View Roster
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assignments List */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <FileCheck2 size={20} className="header-icon" />
                <h3>Recent Course Assignments</h3>
              </div>
              <Link to="/faculty/assignments" className="card-header-action">
                Create & Grade <ChevronRight size={16} />
              </Link>
            </div>

            <div className="assignment-dashboard-list">
              {assignments.length === 0 ? (
                <div className="empty-state-box">
                  <FileCheck2 size={36} className="empty-icon" />
                  <p>No assignments posted yet for your courses.</p>
                  <Link to="/faculty/assignments" className="btn btn-primary-sm mt-2">
                    Create First Assignment
                  </Link>
                </div>
              ) : (
                assignments.map((asg) => (
                  <div key={asg.id} className="assignment-item-box">
                    <div className="assignment-item-header">
                      <span className="asg-course-pill">{asg.courseCode}</span>
                      <span className="status-badge status-info">
                        {asg.submissions?.length || 0} Submissions Received
                      </span>
                    </div>

                    <h4 className="asg-title">{asg.title}</h4>
                    <p className="asg-desc-preview">{asg.description}</p>

                    <div className="asg-item-footer">
                      <span className="asg-deadline">
                        Deadline: {new Date(asg.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      <button
                        className="btn btn-secondary-sm"
                        onClick={() => navigate('/faculty/assignments')}
                      >
                        Manage & Grade
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Faculty Announcements & Recent Campus Activity */}
        <div className="dashboard-col">
          {/* Recent Campus Announcements */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Bell size={20} className="header-icon" />
                <h3>Campus Bulletins & Notices</h3>
              </div>
              <Link to="/faculty/announcements" className="card-header-action">
                Manage Bulletins <ChevronRight size={16} />
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
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="card-header-title">
                <Sparkles size={20} className="header-icon" />
                <h3>Faculty Quick Actions</h3>
              </div>
            </div>

            <div className="quick-actions-grid">
              <button
                className="quick-action-btn"
                onClick={() => navigate('/faculty/assignments')}
              >
                <div className="action-icon-circle action-icon-navy">
                  <FileCheck2 size={20} />
                </div>
                <div className="action-text">
                  <strong>Create Assignment</strong>
                  <span>Publish coursework & set deadlines</span>
                </div>
              </button>

              <button
                className="quick-action-btn"
                onClick={() => navigate('/faculty/announcements')}
              >
                <div className="action-icon-circle action-icon-green">
                  <Bell size={20} />
                </div>
                <div className="action-text">
                  <strong>Post Announcement</strong>
                  <span>Broadcast to students & faculty</span>
                </div>
              </button>

              <button
                className="quick-action-btn"
                onClick={() => navigate('/faculty/courses')}
              >
                <div className="action-icon-circle action-icon-amber">
                  <Users size={20} />
                </div>
                <div className="action-text">
                  <strong>Class Rosters</strong>
                  <span>View enrolled students</span>
                </div>
              </button>

              <button
                className="quick-action-btn"
                onClick={() => navigate('/faculty/profile')}
              >
                <div className="action-icon-circle action-icon-purple">
                  <GraduationCap size={20} />
                </div>
                <div className="action-text">
                  <strong>Office Hours</strong>
                  <span>Update contact & office details</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
