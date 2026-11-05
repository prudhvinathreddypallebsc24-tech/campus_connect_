import {
  initialUsers,
  initialCourses,
  initialAnnouncements,
  initialEvents,
  initialAssignments,
  initialActivities
} from '../data/mockData';

const KEYS = {
  USERS: 'cc_users',
  CURRENT_USER: 'cc_current_user',
  COURSES: 'cc_courses',
  ANNOUNCEMENTS: 'cc_announcements',
  EVENTS: 'cc_events',
  ASSIGNMENTS: 'cc_assignments',
  ACTIVITIES: 'cc_activities'
};

// Helper to safely fetch from localStorage or initialize
const getItem = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultData;
  }
};

const setItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const storageService = {
  // Initialization
  initStorage() {
    if (!localStorage.getItem(KEYS.USERS)) {
      setItem(KEYS.USERS, initialUsers);
    }
    if (!localStorage.getItem(KEYS.COURSES)) {
      setItem(KEYS.COURSES, initialCourses);
    }
    if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
      setItem(KEYS.ANNOUNCEMENTS, initialAnnouncements);
    }
    if (!localStorage.getItem(KEYS.EVENTS)) {
      setItem(KEYS.EVENTS, initialEvents);
    }
    if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
      setItem(KEYS.ASSIGNMENTS, initialAssignments);
    }
    if (!localStorage.getItem(KEYS.ACTIVITIES)) {
      setItem(KEYS.ACTIVITIES, initialActivities);
    }
  },

  resetAllData() {
    setItem(KEYS.USERS, initialUsers);
    setItem(KEYS.COURSES, initialCourses);
    setItem(KEYS.ANNOUNCEMENTS, initialAnnouncements);
    setItem(KEYS.EVENTS, initialEvents);
    setItem(KEYS.ASSIGNMENTS, initialAssignments);
    setItem(KEYS.ACTIVITIES, initialActivities);
  },

  // Auth & Session
  getCurrentUser() {
    try {
      const user = localStorage.getItem(KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      setItem(KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  clearCurrentUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Users
  getUsers() {
    return getItem(KEYS.USERS, initialUsers);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: `usr_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: [],
      assignedCourseIds: [],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      ...userData
    };
    users.push(newUser);
    setItem(KEYS.USERS, users);
    this.logActivity('Registered User', `Added user: ${newUser.name} (${newUser.role})`);
    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      setItem(KEYS.USERS, users);
      
      // Update current user if this is the active session
      const current = this.getCurrentUser();
      if (current && current.id === id) {
        this.setCurrentUser(users[index]);
      }
      return users[index];
    }
    return null;
  },

  deleteUser(id) {
    let users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      users = users.filter(u => u.id !== id);
      setItem(KEYS.USERS, users);
      this.logActivity('Deleted User', `Removed user: ${target.name} (${target.role})`);
      return true;
    }
    return false;
  },

  // Courses
  getCourses() {
    return getItem(KEYS.COURSES, initialCourses);
  },

  getCourseById(id) {
    const courses = this.getCourses();
    return courses.find(c => c.id === id) || null;
  },

  getCoursesForFaculty(facultyId) {
    const courses = this.getCourses();
    return courses.filter(c => c.facultyId === facultyId);
  },

  getCoursesForStudent(studentId) {
    const user = this.getUserById(studentId) || this.getCurrentUser();
    const courses = this.getCourses();
    if (user && user.enrolledCourseIds) {
      return courses.filter(c => user.enrolledCourseIds.includes(c.id));
    }
    return courses.filter(c => c.enrolledStudents && c.enrolledStudents.includes(studentId));
  },

  addCourse(courseData) {
    const courses = this.getCourses();
    const newCourse = {
      id: `crs_${Date.now()}`,
      enrolledStudents: [],
      syllabus: [],
      ...courseData
    };
    courses.push(newCourse);
    setItem(KEYS.COURSES, courses);
    this.logActivity('Created Course', `Created course ${newCourse.code} - ${newCourse.name}`);
    return newCourse;
  },

  // Announcements
  getAnnouncements() {
    return getItem(KEYS.ANNOUNCEMENTS, initialAnnouncements);
  },

  addAnnouncement(data) {
    const announcements = this.getAnnouncements();
    const newAnc = {
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      priority: 'normal',
      ...data
    };
    announcements.unshift(newAnc);
    setItem(KEYS.ANNOUNCEMENTS, announcements);
    this.logActivity('Created Announcement', `Posted: ${newAnc.title}`);
    return newAnc;
  },

  updateAnnouncement(id, updates) {
    const announcements = this.getAnnouncements();
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      announcements[index] = { ...announcements[index], ...updates };
      setItem(KEYS.ANNOUNCEMENTS, announcements);
      return announcements[index];
    }
    return null;
  },

  deleteAnnouncement(id) {
    let announcements = this.getAnnouncements();
    const target = announcements.find(a => a.id === id);
    if (target) {
      announcements = announcements.filter(a => a.id !== id);
      setItem(KEYS.ANNOUNCEMENTS, announcements);
      this.logActivity('Deleted Announcement', `Removed: ${target.title}`);
      return true;
    }
    return false;
  },

  // Events
  getEvents() {
    return getItem(KEYS.EVENTS, initialEvents);
  },

  addEvent(data) {
    const events = this.getEvents();
    const newEvent = {
      id: `evt_${Date.now()}`,
      registeredUserIds: [],
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      ...data
    };
    events.push(newEvent);
    setItem(KEYS.EVENTS, events);
    this.logActivity('Created Event', `Created: ${newEvent.title}`);
    return newEvent;
  },

  updateEvent(id, updates) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      setItem(KEYS.EVENTS, events);
      return events[index];
    }
    return null;
  },

  deleteEvent(id) {
    let events = this.getEvents();
    const target = events.find(e => e.id === id);
    if (target) {
      events = events.filter(e => e.id !== id);
      setItem(KEYS.EVENTS, events);
      this.logActivity('Deleted Event', `Cancelled event: ${target.title}`);
      return true;
    }
    return false;
  },

  registerForEvent(eventId, userId) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      const event = events[index];
      if (!event.registeredUserIds.includes(userId)) {
        event.registeredUserIds.push(userId);
        setItem(KEYS.EVENTS, events);
        this.logActivity('Event Registration', `User registered for: ${event.title}`);
        return { success: true, message: 'Successfully registered for event' };
      }
      return { success: false, message: 'You are already registered for this event' };
    }
    return { success: false, message: 'Event not found' };
  },

  unregisterFromEvent(eventId, userId) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      const event = events[index];
      event.registeredUserIds = event.registeredUserIds.filter(id => id !== userId);
      setItem(KEYS.EVENTS, events);
      this.logActivity('Event Cancellation', `User cancelled registration for: ${event.title}`);
      return { success: true, message: 'Registration cancelled' };
    }
    return { success: false, message: 'Event not found' };
  },

  // Assignments
  getAssignments() {
    return getItem(KEYS.ASSIGNMENTS, initialAssignments);
  },

  getAssignmentsForStudent(studentId) {
    const user = this.getUserById(studentId) || this.getCurrentUser();
    const courseIds = user?.enrolledCourseIds || ['crs_101', 'crs_102', 'crs_103', 'crs_104'];
    const assignments = this.getAssignments();
    return assignments.filter(a => courseIds.includes(a.courseId));
  },

  getAssignmentsForFaculty(facultyId) {
    const assignments = this.getAssignments();
    return assignments.filter(a => a.facultyId === facultyId);
  },

  addAssignment(data) {
    const assignments = this.getAssignments();
    const newAsg = {
      id: `asg_${Date.now()}`,
      submissions: [],
      ...data
    };
    assignments.unshift(newAsg);
    setItem(KEYS.ASSIGNMENTS, assignments);
    this.logActivity('Created Assignment', `Added: ${newAsg.title} (${newAsg.courseCode})`);
    return newAsg;
  },

  updateAssignment(id, updates) {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updates };
      setItem(KEYS.ASSIGNMENTS, assignments);
      return assignments[index];
    }
    return null;
  },

  deleteAssignment(id) {
    let assignments = this.getAssignments();
    const target = assignments.find(a => a.id === id);
    if (target) {
      assignments = assignments.filter(a => a.id !== id);
      setItem(KEYS.ASSIGNMENTS, assignments);
      this.logActivity('Deleted Assignment', `Deleted: ${target.title}`);
      return true;
    }
    return false;
  },

  submitAssignment(assignmentId, studentId, studentName, submissionDetails = {}) {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      const assignment = assignments[index];
      const existingSubIndex = assignment.submissions.findIndex(s => s.studentId === studentId);
      
      const submissionObj = {
        studentId,
        studentName,
        submittedAt: new Date().toISOString(),
        status: 'Submitted',
        fileUrl: submissionDetails.fileName || 'assignment_submission.pdf',
        notes: submissionDetails.notes || '',
        grade: null,
        feedback: null
      };

      if (existingSubIndex >= 0) {
        assignment.submissions[existingSubIndex] = submissionObj;
      } else {
        assignment.submissions.push(submissionObj);
      }

      setItem(KEYS.ASSIGNMENTS, assignments);
      this.logActivity('Assignment Submitted', `${studentName} submitted ${assignment.title}`);
      return { success: true, submission: submissionObj };
    }
    return { success: false, message: 'Assignment not found' };
  },

  // Activity Log
  getActivities() {
    return getItem(KEYS.ACTIVITIES, initialActivities);
  },

  logActivity(action, details, user = null) {
    const currentUser = user || this.getCurrentUser();
    const activities = this.getActivities();
    const newAct = {
      id: `act_${Date.now()}`,
      user: currentUser ? currentUser.name : 'System Admin',
      role: currentUser ? currentUser.role : 'admin',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    activities.unshift(newAct);
    // keep max 50 activities
    if (activities.length > 50) activities.pop();
    setItem(KEYS.ACTIVITIES, activities);
  }
};

// Auto-run init
storageService.initStorage();
