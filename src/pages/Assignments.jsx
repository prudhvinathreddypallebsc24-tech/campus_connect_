import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Eye,
  Award,
  Search,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Assignments = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Faculty modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [totalPoints, setTotalPoints] = useState(100);

  // Student submission modal states
  const [submittingAsg, setSubmittingAsg] = useState(null);
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Faculty viewing submissions modal
  const [viewingSubmissionsAsg, setViewingSubmissionsAsg] = useState(null);

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    if (isStudent) {
      setAssignments(storageService.getAssignmentsForStudent(user.id));
      setCourses(storageService.getCoursesForStudent(user.id));
    } else if (isFaculty) {
      setAssignments(storageService.getAssignmentsForFaculty(user.id));
      setCourses(storageService.getCoursesForFaculty(user.id));
    } else {
      setAssignments(storageService.getAssignments());
      setCourses(storageService.getCourses());
    }
  };

  // Faculty Create / Edit Assignment
  const handleOpenCreate = () => {
    setEditingAsg(null);
    setSelectedCourseId(courses[0]?.id || 'crs_101');
    setTitle('');
    setDescription('');
    // Default deadline 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDeadline(d.toISOString().slice(0, 16));
    setTotalPoints(100);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (asg) => {
    setEditingAsg(asg);
    setSelectedCourseId(asg.courseId);
    setTitle(asg.title);
    setDescription(asg.description);
    setDeadline(asg.deadline ? asg.deadline.slice(0, 16) : '');
    setTotalPoints(asg.totalPoints || 100);
    setIsCreateModalOpen(true);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !deadline) {
      showToast('Please provide all assignment details', 'error');
      return;
    }

    const courseObj = courses.find((c) => c.id === selectedCourseId) || courses[0];

    if (editingAsg) {
      storageService.updateAssignment(editingAsg.id, {
        title: title.trim(),
        description: description.trim(),
        courseId: courseObj ? courseObj.id : selectedCourseId,
        courseCode: courseObj ? courseObj.code : 'CS301',
        courseName: courseObj ? courseObj.name : 'Computer Science',
        deadline,
        totalPoints: Number(totalPoints)
      });
      showToast('Assignment updated successfully', 'success');
    } else {
      storageService.addAssignment({
        courseId: courseObj ? courseObj.id : selectedCourseId,
        courseCode: courseObj ? courseObj.code : 'CS301',
        courseName: courseObj ? courseObj.name : 'Computer Science',
        facultyId: user.id,
        facultyName: user.name,
        title: title.trim(),
        description: description.trim(),
        deadline,
        totalPoints: Number(totalPoints)
      });
      showToast('New assignment published to student course rosters', 'success');
    }

    setIsCreateModalOpen(false);
    loadData();
  };

  // Student Submit Assignment
  const handleOpenSubmit = (asg) => {
    setSubmittingAsg(asg);
    const existing = asg.submissions?.find((s) => s.studentId === user.id);
    setSubmissionFileName(existing ? existing.fileUrl : `${user.name.toLowerCase().replace(/\s+/g, '_')}_solution.zip`);
    setSubmissionNotes(existing ? existing.notes || '' : '');
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submissionFileName.trim()) {
      showToast('Please specify a submission file name', 'error');
      return;
    }

    storageService.submitAssignment(submittingAsg.id, user.id, user.name, {
      fileName: submissionFileName.trim(),
      notes: submissionNotes.trim()
    });

    showToast(`Assignment "${submittingAsg.title}" submitted successfully!`, 'success');
    setSubmittingAsg(null);
    loadData();
  };

  // Delete Assignment
  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      storageService.deleteAssignment(deleteTargetId);
      showToast('Assignment removed', 'info');
      setDeleteTargetId(null);
      loadData();
    }
  };

  const filteredAssignments = assignments.filter((asg) => {
    const q = searchTerm.toLowerCase();
    return (
      asg.title.toLowerCase().includes(q) ||
      asg.courseCode.toLowerCase().includes(q) ||
      asg.courseName.toLowerCase().includes(q) ||
      asg.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-main-title">
            {isStudent
              ? 'Academic Assignments & Submissions'
              : isFaculty
              ? 'Coursework & Assignment Manager'
              : 'Campus Assignment Tracking'}
          </h2>
          <p className="page-sub-title">
            {isStudent
              ? 'Track deadlines, upload solutions, and review faculty evaluations.'
              : isFaculty
              ? 'Create course assignments, set point values, and evaluate student submissions.'
              : 'Audit of active assignments and university submission rates.'}
          </p>
        </div>

        {isFaculty && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-card">
        <div className="filter-search-box w-full">
          <Search size={18} className="filter-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search assignments by title, course code, or description..."
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

      {/* Assignments List */}
      <div className="assignments-stack-grid">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state-card col-span-full">
            <FileCheck2 size={48} className="empty-state-icon" />
            <h3>No Assignments Found</h3>
            <p>
              {isStudent
                ? 'Great job! You have no assignments listed currently.'
                : 'No assignments have been created yet.'}
            </p>
            {isFaculty && (
              <button className="btn btn-primary mt-3" onClick={handleOpenCreate}>
                <Plus size={16} /> Create First Assignment
              </button>
            )}
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const studentSub = isStudent
              ? asg.submissions?.find((s) => s.studentId === user?.id)
              : null;
            const isSubmitted = !!studentSub;
            const submissionCount = asg.submissions ? asg.submissions.length : 0;
            const isPastDeadline = new Date(asg.deadline) < new Date();

            return (
              <div key={asg.id} className="assignment-full-card">
                <div className="asg-card-top-row">
                  <div className="asg-course-label-box">
                    <span className="asg-course-code-tag">{asg.courseCode}</span>
                    <span className="asg-course-fullname">{asg.courseName}</span>
                  </div>

                  <div className="asg-points-badge">
                    <Award size={14} />
                    <span>{asg.totalPoints || 100} Points</span>
                  </div>
                </div>

                <div className="asg-card-body">
                  <h3 className="asg-main-title">{asg.title}</h3>
                  <p className="asg-description-full">{asg.description}</p>
                </div>

                {/* Feedback Box if student has a graded submission */}
                {studentSub && studentSub.grade && (
                  <div className="asg-grade-feedback-box">
                    <div className="grade-header">
                      <span className="grade-score">Grade: {studentSub.grade}</span>
                      <span className="status-badge status-success">Evaluated</span>
                    </div>
                    {studentSub.feedback && (
                      <p className="grade-comment">Instructor Note: "{studentSub.feedback}"</p>
                    )}
                  </div>
                )}

                <div className="asg-card-bottom-bar">
                  <div className="asg-timeline-col">
                    <div className="asg-deadline-row">
                      <Calendar size={15} />
                      <span>
                        Deadline:{' '}
                        <strong>
                          {new Date(asg.deadline).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </strong>
                      </span>
                    </div>
                    <span className="asg-faculty-name">Instructor: {asg.facultyName}</span>
                  </div>

                  <div className="asg-actions-col">
                    {/* Student Action */}
                    {isStudent && (
                      <div className="student-asg-actions">
                        {isSubmitted ? (
                          <div className="submitted-status-group">
                            <span className="status-badge status-success">
                              <CheckCircle2 size={13} /> Submitted ({studentSub.fileUrl})
                            </span>
                            <button
                              className="btn btn-secondary-sm"
                              onClick={() => handleOpenSubmit(asg)}
                            >
                              Resubmit
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleOpenSubmit(asg)}
                          >
                            <UploadCloud size={16} /> Submit Solution
                          </button>
                        )}
                      </div>
                    )}

                    {/* Faculty Actions */}
                    {isFaculty && (
                      <div className="faculty-asg-actions">
                        <button
                          className="btn btn-secondary-sm"
                          onClick={() => setViewingSubmissionsAsg(asg)}
                        >
                          <Eye size={15} /> Submissions ({submissionCount})
                        </button>
                        <button
                          className="icon-action-btn"
                          onClick={() => handleOpenEdit(asg)}
                          title="Edit assignment"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="icon-action-btn delete-btn"
                          onClick={() => setDeleteTargetId(asg.id)}
                          title="Delete assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="admin-asg-actions">
                        <button
                          className="btn btn-secondary-sm"
                          onClick={() => setViewingSubmissionsAsg(asg)}
                        >
                          <Eye size={15} /> View Roster ({submissionCount})
                        </button>
                        <button
                          className="icon-action-btn delete-btn"
                          onClick={() => setDeleteTargetId(asg.id)}
                          title="Delete assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Faculty Create / Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingAsg ? 'Edit Assignment' : 'Create Course Assignment'}
        subtitle="Publish a problem set or project milestone with submission parameters."
        maxWidth="600px"
      >
        <form onSubmit={handleSaveAssignment} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="asg-course">
              Associated Course *
            </label>
            <select
              id="asg-course"
              className="form-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="asg-title">
              Assignment Title *
            </label>
            <input
              id="asg-title"
              type="text"
              className="form-input"
              placeholder="e.g. Lab 3: Concurrent Memory Cache Simulation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="asg-deadline">
                Submission Due Date & Time *
              </label>
              <input
                id="asg-deadline"
                type="datetime-local"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="asg-points">
                Maximum Points
              </label>
              <input
                id="asg-points"
                type="number"
                min="1"
                className="form-input"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="asg-desc">
              Assignment Instructions & Specifications *
            </label>
            <textarea
              id="asg-desc"
              rows={4}
              className="form-textarea"
              placeholder="Detail the problem statement, acceptable programming languages, unit test requirements, and formatting guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAsg ? 'Save Changes' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Submit Modal */}
      <Modal
        isOpen={!!submittingAsg}
        onClose={() => setSubmittingAsg(null)}
        title={`Submit Work: ${submittingAsg?.title || ''}`}
        subtitle={`Course: ${submittingAsg?.courseCode} • Maximum Points: ${submittingAsg?.totalPoints || 100}`}
        maxWidth="500px"
      >
        <form onSubmit={handleConfirmSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Attached Submission Archive *</label>
            <div className="mock-upload-dropzone">
              <UploadCloud size={32} className="text-secondary" />
              <p className="dropzone-text">File will be persistently registered in your profile</p>
              <input
                type="text"
                className="form-input mt-2"
                placeholder="filename.zip or filename.pdf"
                value={submissionFileName}
                onChange={(e) => setSubmissionFileName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Submission Notes (Optional)</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="e.g. Implemented Bonus Question 3 using SIMD vectorization. All automated test assertions pass."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSubmittingAsg(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Submit Work
            </button>
          </div>
        </form>
      </Modal>

      {/* Faculty Submissions Review Modal */}
      <Modal
        isOpen={!!viewingSubmissionsAsg}
        onClose={() => setViewingSubmissionsAsg(null)}
        title={`Student Submissions: ${viewingSubmissionsAsg?.title || ''}`}
        subtitle={`Total submissions: ${viewingSubmissionsAsg?.submissions?.length || 0}`}
        maxWidth="600px"
      >
        <div className="submissions-modal-content">
          {(!viewingSubmissionsAsg?.submissions || viewingSubmissionsAsg.submissions.length === 0) ? (
            <div className="empty-state-box">
              <FileCheck2 size={36} />
              <p>No student submissions received for this assignment yet.</p>
            </div>
          ) : (
            <div className="submissions-list">
              {viewingSubmissionsAsg.submissions.map((sub, idx) => (
                <div key={idx} className="submission-row-card">
                  <div className="submission-info-col">
                    <div className="submission-user-header">
                      <strong className="sub-user-name">{sub.studentName}</strong>
                      <span className="sub-timestamp">
                        {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="submission-file-pill">
                      <FileText size={14} />
                      <span>{sub.fileUrl}</span>
                    </div>

                    {sub.notes && <p className="sub-notes">Student Note: "{sub.notes}"</p>}
                  </div>

                  <div className="submission-grading-col">
                    {sub.grade ? (
                      <span className="status-badge status-success">Graded: {sub.grade}</span>
                    ) : (
                      <span className="status-badge status-warning">Pending Review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setViewingSubmissionsAsg(null)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Assignment Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assignment?"
        message="Are you sure you want to permanently delete this assignment? All current student submissions and grades for this assignment will be removed."
        confirmText="Yes, Delete Assignment"
      />
    </div>
  );
};
