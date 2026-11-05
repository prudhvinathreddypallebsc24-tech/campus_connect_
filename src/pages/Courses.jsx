import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Users,
  Clock,
  MapPin,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';

export const Courses = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseRoster, setSelectedCourseRoster] = useState(null);
  const [expandedSyllabusId, setExpandedSyllabusId] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = () => {
    if (!user) return;
    if (user.role === 'student') {
      setCourses(storageService.getCoursesForStudent(user.id));
    } else if (user.role === 'faculty') {
      setCourses(storageService.getCoursesForFaculty(user.id));
    } else {
      setCourses(storageService.getCourses());
    }
  };

  const filteredCourses = courses.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.facultyName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  const toggleSyllabus = (id) => {
    setExpandedSyllabusId(expandedSyllabusId === id ? null : id);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">
            {user?.role === 'student'
              ? 'My Enrolled Courses'
              : user?.role === 'faculty'
              ? 'Assigned Teaching Modules'
              : 'University Course Catalog'}
          </h2>
          <p className="page-sub-title">
            {user?.role === 'student'
              ? 'Review course syllabi, faculty contacts, classroom locations, and weekly timetables.'
              : user?.role === 'faculty'
              ? 'Manage lecture allocations, course syllabi, and view enrolled class rosters.'
              : 'Complete directory of registered academic courses and faculty instructors.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-card">
        <div className="filter-search-box w-full">
          <Search size={18} className="filter-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by course code, name, professor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="filter-clear-btn" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Course List */}
      <div className="course-cards-stack">
        {filteredCourses.length === 0 ? (
          <div className="empty-state-card">
            <BookOpen size={48} className="empty-state-icon" />
            <h3>No Courses Found</h3>
            <p>No courses match your search query.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const enrolledCount = course.enrolledStudents ? course.enrolledStudents.length : 0;
            const isSyllabusExpanded = expandedSyllabusId === course.id;

            return (
              <div key={course.id} className="course-detailed-card">
                <div className="course-card-top">
                  <div className="course-title-section">
                    <div className="course-code-badge-row">
                      <span className="course-code-tag">{course.code}</span>
                      <span className="course-credits-badge">{course.credits} Credits</span>
                      <span className="course-semester-tag">{course.semester || 'Fall 2026'}</span>
                    </div>
                    <h3 className="course-name-heading">{course.name}</h3>
                    <p className="course-dept-text">{course.department}</p>
                  </div>

                  <div className="course-faculty-profile-box">
                    <div className="faculty-badge-avatar">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <span className="faculty-label">Lead Faculty</span>
                      <h4 className="faculty-name-text">{course.facultyName}</h4>
                    </div>
                  </div>
                </div>

                <p className="course-description-text">{course.description}</p>

                {/* Course Logistics Bar */}
                <div className="course-logistics-bar">
                  <div className="logistics-pill">
                    <Clock size={15} />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="logistics-pill">
                    <MapPin size={15} />
                    <span>{course.room}</span>
                  </div>
                  <div className="logistics-pill">
                    <Users size={15} />
                    <span>{enrolledCount} Students Enrolled</span>
                  </div>
                </div>

                {/* Expandable Syllabus Section */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="course-syllabus-wrapper">
                    <button
                      className="syllabus-toggle-btn"
                      onClick={() => toggleSyllabus(course.id)}
                    >
                      <span>Course Syllabus & Curricular Timeline ({course.syllabus.length} Modules)</span>
                      {isSyllabusExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isSyllabusExpanded && (
                      <div className="syllabus-content slide-in">
                        <ul className="syllabus-timeline-list">
                          {course.syllabus.map((topic, idx) => (
                            <li key={idx} className="syllabus-item">
                              <span className="syllabus-bullet">{idx + 1}</span>
                              <span className="syllabus-text">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="course-card-footer">
                  <div className="course-footer-note">
                    {user?.role === 'student' && (
                      <span className="enrolled-indicator">
                        <CheckCircle2 size={15} /> Officially Enrolled for Credit
                      </span>
                    )}
                  </div>

                  <div className="course-footer-actions">
                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                      <button
                        className="btn btn-secondary-sm"
                        onClick={() => setSelectedCourseRoster(course)}
                      >
                        <Users size={15} /> View Enrolled Class Roster ({enrolledCount})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Class Roster Modal */}
      <Modal
        isOpen={!!selectedCourseRoster}
        onClose={() => setSelectedCourseRoster(null)}
        title={`Enrolled Students: ${selectedCourseRoster?.code} - ${selectedCourseRoster?.name}`}
        subtitle={`Total registered learners: ${selectedCourseRoster?.enrolledStudents?.length || 0}`}
        maxWidth="550px"
      >
        <div className="roster-modal-content">
          {(!selectedCourseRoster?.enrolledStudents || selectedCourseRoster.enrolledStudents.length === 0) ? (
            <div className="empty-state-box">
              <Users size={32} />
              <p>No students enrolled yet for this class section.</p>
            </div>
          ) : (
            <div className="roster-list">
              {selectedCourseRoster.enrolledStudents.map((studentId) => {
                const student = storageService.getUserById(studentId);
                return (
                  <div key={studentId} className="roster-item">
                    <img
                      src={student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={student?.name || 'Student'}
                      className="roster-avatar"
                    />
                    <div className="roster-info">
                      <h4 className="roster-name">{student?.name || 'Student'}</h4>
                      <p className="roster-meta">
                        ID: {student?.studentId || 'N/A'} • {student?.department} • {student?.semester || '5th Sem'}
                      </p>
                      <span className="roster-email">{student?.email}</span>
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
              onClick={() => setSelectedCourseRoster(null)}
            >
              Close Roster
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
