/**
 * studentController.js
 * Campus Connect — CS3301 Experiment 6
 *
 * STUDENT CONTROLLER
 *
 * Contains the handler functions for each REST endpoint.
 * Controllers are responsible for:
 *   1. Reading data from req (body, params, query)
 *   2. Performing the CRUD operation on the data store
 *   3. Sending the appropriate HTTP response
 *   4. Forwarding errors to errorHandler via next(error)
 *
 * ─────────────────────────────────────────────────────────────
 * CRUD → HTTP METHOD MAPPING
 * ─────────────────────────────────────────────────────────────
 *  Create → POST   /api/students
 *  Read   → GET    /api/students        (all)
 *  Read   → GET    /api/students/:id    (one)
 *  Update → PUT    /api/students/:id
 *  Delete → DELETE /api/students/:id
 * ─────────────────────────────────────────────────────────────
 */

const students = require('../data/students');

// ── Utility: generate next student ID ───────────────────────
const generateId = () => {
  if (students.length === 0) return 'STU001';
  const nums = students.map((s) => parseInt(s.id.replace('STU', ''), 10));
  const max = Math.max(...nums);
  return `STU${String(max + 1).padStart(3, '0')}`;
};

// ── Utility: simple email format check ──────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Utility: create error with status code ──────────────────
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ============================================================
// GET /api/students
// READ ALL — returns every student in the store
// ============================================================
const getAllStudents = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// GET /api/students/:id
// READ ONE — returns a single student by ID
// ============================================================
const getStudentById = (req, res, next) => {
  try {
    const student = students.find((s) => s.id === req.params.id);

    if (!student) {
      return next(createError(`Student with ID '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// POST /api/students
// CREATE — validates input and adds a new student
// ============================================================
const createStudent = (req, res, next) => {
  try {
    const { name, email, department, year, skills } = req.body;

    // ── Input Validation ─────────────────────────────────────
    if (!name || !name.trim()) {
      return next(createError('Name is required', 400));
    }
    if (!email || !email.trim()) {
      return next(createError('Email is required', 400));
    }
    if (!isValidEmail(email.trim())) {
      return next(createError('Invalid email format', 400));
    }
    if (!department || !department.trim()) {
      return next(createError('Department is required', 400));
    }
    if (year === undefined || year === null || year === '') {
      return next(createError('Year is required', 400));
    }
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 5) {
      return next(createError('Year must be an integer between 1 and 5', 400));
    }
    if (skills !== undefined && !Array.isArray(skills)) {
      return next(createError('Skills must be an array of strings', 400));
    }

    // ── Duplicate email check ─────────────────────────────────
    const duplicate = students.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (duplicate) {
      return next(createError('A student with this email already exists', 400));
    }

    // ── Create new student ────────────────────────────────────
    const newStudent = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      year,
      skills: skills || [],
    };

    students.push(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// PUT /api/students/:id
// UPDATE — finds student by ID and updates supplied fields
// ============================================================
const updateStudent = (req, res, next) => {
  try {
    const index = students.findIndex((s) => s.id === req.params.id);

    if (index === -1) {
      return next(createError(`Student with ID '${req.params.id}' not found`, 404));
    }

    const { name, email, department, year, skills } = req.body;

    // ── Validate only fields that are provided ────────────────
    if (email !== undefined && !isValidEmail(email.trim())) {
      return next(createError('Invalid email format', 400));
    }
    if (year !== undefined) {
      if (typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 5) {
        return next(createError('Year must be an integer between 1 and 5', 400));
      }
    }
    if (skills !== undefined && !Array.isArray(skills)) {
      return next(createError('Skills must be an array of strings', 400));
    }

    // ── Merge updates with existing student ──────────────────
    const updatedStudent = {
      ...students[index],
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(department && { department: department.trim() }),
      ...(year !== undefined && { year }),
      ...(skills !== undefined && { skills }),
    };

    students[index] = updatedStudent;

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// DELETE /api/students/:id
// DELETE — removes student from the in-memory store
// ============================================================
const deleteStudent = (req, res, next) => {
  try {
    const index = students.findIndex((s) => s.id === req.params.id);

    if (index === -1) {
      return next(createError(`Student with ID '${req.params.id}' not found`, 404));
    }

    const deleted = students.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
